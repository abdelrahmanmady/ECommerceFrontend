import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class CityService {

    private cities: { [countryName: string]: string[] } = {
        'Egypt': [
            'Cairo', 'Alexandria', 'Giza', 'Shubra El-Kheima', 'Port Said', 'Suez',
            'Luxor', 'Mansoura', 'El-Mahalla El-Kubra', 'Tanta', 'Asyut', 'Ismailia',
            'Fayyum', 'Zagazig', 'Aswan', 'Damietta', 'Damanhur', 'Minya', 'Beni Suef',
            'Hurghada', 'Sohag', '6th of October', 'Shibin El Kom', 'Banha', 'Kafr El Sheikh',
            'Arish', 'Mallawi', '10th of Ramadan', 'Bilbais', 'Marsa Matruh', 'Idfu',
            'Mit Ghamr', 'Al-Hamidiyya', 'Desouk', 'Qalyub', 'Abu Kabir', 'Kafr el-Dawwar',
            'Girga', 'Akhmim', 'Matartawy'
        ]
    };

    getCities(countryName: string): string[] {
        return this.cities[countryName] || [];
    }

    getCountries(): string[] {
        return Object.keys(this.cities);
    }
}
