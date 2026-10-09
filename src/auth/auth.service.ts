import {ConflictException, Injectable, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./user.entity";
import {Repository} from "typeorm";
import {RegisterDto} from "./dto/register.dto";
import * as argon2 from "argon2";
import {JwtService} from "@nestjs/jwt";
import {JwtPayload} from "./decorators/current-user.decorator";
import {AuthDto} from "./dto/auth.dto";

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private readonly userRepository: Repository<User>, private readonly jwtService: JwtService,
    ) {}

    async register(dto: RegisterDto) {
        const check = await this.userRepository.findOneBy({ email: dto.email });
        if (check) {
            throw new ConflictException()
        }
        const newUser = await this.userRepository.create({
            email: dto.email,
            password: await argon2.hash(dto.password),
            name: dto.name,
        });
        await this.userRepository.save(newUser);
        return {
            success: true,
            user: {
                name: newUser.name,
                email: newUser.email,
            }
        }
    }

    async login(dto: AuthDto): Promise<string> {
        const user = await this.userRepository.findOne({
            where: { email: dto.email },
            select: { id: true, role: true, password: true }, // пароль достаём явно
        });

        const ok = user && (await argon2.verify(user.password, dto.password));
        if (!ok) throw new UnauthorizedException('Неверный email или пароль');

        return this.signToken(user);
    }

    me(userId: string) {
        return this.userRepository.findOneBy({ id: userId }); // пароля тут не будет
    }

    private signToken(user: User): Promise<string> {
        const payload: JwtPayload = { sub: user.id, role: user.role };
        return this.jwtService.signAsync(payload);
    }

}
