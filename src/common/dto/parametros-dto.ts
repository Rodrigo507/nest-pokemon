import { IsNumber, IsOptional, IsPositive, Min } from "class-validator";

export class ParametrosDto {

    @IsOptional()
    @IsPositive()
    @IsNumber()
    limit?: number;

    @IsOptional()
    @IsPositive()
    @IsNumber()
    offset?: number;
}