import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { Model, isValidObjectId } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class PokemonService {

  /**
   *
   */
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>) { }

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

  async findAll() {
    return await this.pokemonModel.find()
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
