import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
      ) {}
    
    generateJwt(user: any) {
        const payload = { username: user.username, id: user.id, phone: user.phone, email: user.email };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}
