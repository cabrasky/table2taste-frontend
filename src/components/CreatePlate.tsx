import React, { useState } from 'react';
import axios from 'axios';

interface PlateFormProps {
    onSuccess: () => void; // Callback function to execute on successful submission
}

const CreatePlate: React.FC<PlateFormProps> = ({ onSuccess }) => {
    const [plateData, setPlateData] = useState({
        price: '',
        media_url: '',
        translations: [{ language_id: '', translation_key: '', value: '' }],
    });

    const handleInputChange = (index: number, event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        const newTranslations = [...plateData.translations];
        newTranslations[index] = { ...newTranslations[index], [name]: value };
        setPlateData({ ...plateData, translations: newTranslations });
    };

    const handleAddTranslation = () => {
        setPlateData({
            ...plateData,
            translations: [...plateData.translations, { language_id: '', translation_key: '', value: '' }],
        });
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/plates', plateData);
            console.log('Plate added:', response.data);
            onSuccess(); // Call the success callback
        } catch (error) {
            console.error('Error adding plate:', error);
        }
    };

    return (
        <div>
            <h2>Add New Plate</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="price">Price:</label>
                    <input
                        type="text"
                        id="price"
                        name="price"
                        value={plateData.price}
                        onChange={(e) => setPlateData({ ...plateData, price: e.target.value })}
                    />
                </div>
                <div>
                    <label htmlFor="media_url">Media URL:</label>
                    <input
                        type="text"
                        id="media_url"
                        name="media_url"
                        value={plateData.media_url}
                        onChange={(e) => setPlateData({ ...plateData, media_url: e.target.value })}
                    />
                </div>
                <div>
                    <h3>Translations:</h3>
                    {plateData.translations.map((translation, index) => (
                        <div key={index}>
                            <label htmlFor={`language_id-${index}`}>Language ID:</label>
                            <input
                                type="text"
                                id={`language_id-${index}`}
                                name="language_id"
                                value={translation.language_id}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            <label htmlFor={`translation_key-${index}`}>Translation Key:</label>
                            <input
                                type="text"
                                id={`translation_key-${index}`}
                                name="translation_key"
                                value={translation.translation_key}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                            <label htmlFor={`value-${index}`}>Value:</label>
                            <input
                                type="text"
                                id={`value-${index}`}
                                name="value"
                                value={translation.value}
                                onChange={(e) => handleInputChange(index, e)}
                            />
                        </div>
                    ))}
                    <button type="button" onClick={handleAddTranslation}>
                        Add Translation
                    </button>
                </div>
                <button type="submit">Add Plate</button>
            </form>
        </div>
    );
};

export default CreatePlate;
