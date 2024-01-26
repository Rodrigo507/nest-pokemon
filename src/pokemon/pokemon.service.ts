import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { ParametrosDto } from 'src/common/dto/parametros-dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  /**
   *
   */
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.getOrThrow('defaulLimit')

  }
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      console.log("Pokemon crado");
      createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;
    } catch (error) {
      this.handleException(error);

    }
  }

  async findAll(queryParam: ParametrosDto) {

    // console.log(queryParams);
    const { limit = this.defaultLimit, offset = 0 } = queryParam
    // 10 y 0 por default

    return await this.pokemonModel.find()
      .limit(limit)
      .skip(offset)
      .select("-__v")// con el - evitamos mostar X columna
      .sort({
        no: 1 //Ordemaos asendente
      })
  }

  async findOne(id: string) {
    // se declara la variable para almacenar el pokemin
    let pokemon: Pokemon

    // no
    if (!isNaN(+id)) {
      pokemon = await this.pokemonModel.findOne({ 'no': id })
    }

    //MongoID
    if (isValidObjectId(id)) {
      pokemon = await this.pokemonModel.findById(id)
    }

    //Name
    if (!pokemon) {
      pokemon = await this.pokemonModel.findOne({ 'name': id.toLocaleLowerCase() })
    }


    if (!pokemon) {
      throw new NotFoundException(`No se encontro el pokemon con el id/no/name '${id}' en la DB`)

    }


    return pokemon;
  }

  async update(id: string, updatePokemonDto: UpdatePokemonDto) {
    // verificar que el pokemon esxita
    const pokemon = await this.findOne(id);

    // si el update contiene nombre se le aplica el lowecase
    if (updatePokemonDto.name) {
      updatePokemonDto.name = updatePokemonDto.name.toLowerCase();
    }
    try {
      // realizar la actualizacion
      await pokemon.updateOne(updatePokemonDto);
      //retornar el objeto actualizado
      return { ...pokemon.toJSON(), ...updatePokemonDto }

    } catch (error) {
      this.handleException(error);

    }
  }

  async remove(id: string) {
    // verificar que el pokemon esxita
    // const pokemon = await this.findOne(id);

    // await this.pokemonModel.deleteOne()
    // await this.pokemonModel.findByIdAndDelete(id)

    const { deletedCount, acknowledged } = await this.pokemonModel.deleteOne({ '_id': id })

    if (deletedCount === 0) {
      throw new NotFoundException(`EL id '${id}' no existe`)
    }

    return;
  }

  //metodo para errores
  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(`Pokemon exists in DB ${JSON.stringify(error.keyPattern)}`)
    }
    throw new InternalServerErrorException(error)
  }
}
