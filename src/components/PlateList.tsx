import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Plate {
    id: number;
    price: number;
    media_url: string;
    translations?: {
        name: PlateTranslation[];
        description: PlateTranslation[];
    };
}

interface PlateTranslation {
    language_id: string;
    translation_key: string;
    value: string;
}

const PlateList: React.FC = () => {
    const [plates, setPlates] = useState<Plate[]>([]);

    useEffect(() => {
        fetchPlates();
    }, []);

    const fetchPlates = async () => {
        try {
            const response = await axios.get<Plate[]>('http://localhost:8000/api/plates');
            setPlates(response.data);
        } catch (error) {
            console.error('Error fetching plates:', error);
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await axios.delete(`http://localhost:8000/api/plates/${id}`);
            fetchPlates(); // Refresh plates after delete
        } catch (error) {
            console.error('Error deleting plate:', error);
        }
    };

    return (
        <div>
            <h2>Plate List</h2>
            <ul>
                {plates.map((plate) => (
                    <li key={plate.id}>
                        <span>{`ID: ${plate.id}`}</span>
                        <span>{`Price: ${plate.price}`}</span>
                        <span>{`Media URL: ${plate.media_url}`}</span>
                        {plate.translations && (
                            <div>
                                <h4>Translations:</h4>
                                <ul>
                                    {plate.translations.name.map((translation) => (
                                        <li key={`${plate.id}_${translation.language_id}`}>
                                            {`${translation.language_id}: Name - ${translation.value}`}
                                        </li>
                                    ))}
                                    {plate.translations.description.map((translation) => (
                                        <li key={`${plate.id}_${translation.language_id}`}>
                                            {`${translation.language_id}: Description - ${translation.value}`}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                        <button onClick={() => handleDelete(plate.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PlateList;
