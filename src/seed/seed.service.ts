import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from "axios";
import { PokeResponse } from './interfaces/poke-response.interface';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios

  async executeSeed() {
    const { data } = await axios.get<PokeResponse>(`https://pokeapi.co/api/v2/pokemon?limit=2`)
    data.results.forEach(({ name, url }) => {
      const data_split = url.split('/')
      const no = +data_split[data_split.length - 2]
      console.log(`Nombre: ${name} no: ${no}`);

    })
    return data.results

  }
}
