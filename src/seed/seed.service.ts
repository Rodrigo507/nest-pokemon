import { Injectable } from '@nestjs/common';
import { PokeResponse } from './interfaces/poke-response.interface';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios-adapter';

@Injectable()
export class SeedService {

  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ) { }

  async executeSeed() {

    await this.pokemonModel.deleteMany({})// DELETE * FROM table_name

    const data = await this.http.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=60`)
    const lista: { name: string, no: number }[] = []

    data.results.forEach(({ name, url }) => {
      const data_split = url.split('/')
      const no = +data_split[data_split.length - 2]
      // console.log(`Nombre: ${name} no: ${no}`);
      // const pokemon = await this.pokemonModel.create({ name, no });
      lista.push({ name, no })
    })

    await this.pokemonModel.insertMany(lista)
    return 'Seed inserted'

  }
}
