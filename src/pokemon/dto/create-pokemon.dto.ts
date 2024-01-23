import { IsAlpha, IsInt, IsPositive, IsString, Min, MinLength } from "class-validator";

export class CreatePokemonDto {

    @IsString()
    @MinLength(1)
    @IsAlpha()
    name: string;


    @IsPositive()
    @Min(1)
    @IsInt()
    readonly no: number;


}
