import React, { useState, useEffect, useRef } from 'react';
import { Category } from '../../models/Category';
import { categoryService } from '../../services/CategoryService';
import { usePopup } from '../../contexts/PopupContext';
import { useNavigate } from 'react-router-dom';
import Translate from '../Translate';
import { Language } from '../../models/Language';
import { languageService } from '../../services/LanguageService';

interface CategoryFormProps {
    categoryId?: string;
    defaultParentCategoryId?: string;
}

interface CategoryTranslation {
    name: string;
}

interface CategoryTranslationGroup {
    [key: string]: CategoryTranslation
}

const CategoryForm: React.FC<CategoryFormProps> = ({ categoryId, defaultParentCategoryId = "" }) => {
    const { createPopup, closePopup } = usePopup();
    const navigate = useNavigate();

    const [id, setId] = useState<string>("")
    const [mediaUrl, setMediaUrl] = useState<string>('');
    const [parentCategoryId, setParentCategoryId] = useState<string>("");
    const [translations, setTranslations] = useState<CategoryTranslationGroup>({});
    const [languages, setLanguages] = useState<Language[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const languageSelector = useRef<HTMLSelectElement>(null);

    useEffect(() => {
        setParentCategoryId(defaultParentCategoryId);
        const fetchCategories = async () => {
            try {
                const allCategories = await categoryService.getAll();
                setCategories(allCategories);
            } catch (error) {
                createPopup('error', 'Error loading categories');
            }
        };

        const fetchLanguages = async () => {
            try {
                const languages = await languageService.getAll();
                setLanguages(languages);
            } catch (error) {
                createPopup('error', "Error Loading");
            }
        };

        const fetchCategory = async (id: string) => {
            setId(id);
            try {
                const category = await categoryService.get(id);
                setMediaUrl(category.mediaUrl);
                setParentCategoryId(category.parentCategoryId || defaultParentCategoryId);
                const translationsObject: CategoryTranslationGroup = {};
                category.translations.forEach(translation => {
                    if (translation.language && translation.language.id) {
                        const languageId = translation.language.id;
                        const translationKey = translation.translationKey as keyof CategoryTranslation;
                        translationsObject[languageId] = translationsObject[languageId] || {};
                        translationsObject[languageId][translationKey] = translation.value;
                    }
                });
                setTranslations(translationsObject);
            } catch (error) {
                createPopup('error', 'Error loading the category');
                navigate(new URL('..', window.location.href).pathname);
            }
        };

        async function fetchData() {
            createPopup('loading', "Loading");
            Promise.all([fetchCategories(), fetchLanguages()]).then(() => {
                closePopup();
            });
        }
        fetchData();
        if (categoryId) {
            fetchCategory(categoryId);
        }
    }, [categoryId, defaultParentCategoryId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const category: Category = {
                mediaUrl: mediaUrl,
                parentCategoryId: parentCategoryId,
                translations: Object.entries(translations).map(([languageId, translation]) => (
                    {
                        language: {
                            id: languageId
                        },
                        translationKey: "name",
                        value: translation.name
                    }
                )),
                menuItems: [],
                subCategories: [],
                id: id
            };

            if (categoryId) {
                await categoryService.update(categoryId, category);
            } else {
                await categoryService.create(category);
            }
            createPopup('success', 'Category saved successfully');
            navigate(new URL(categoryId ? '..' : './', window.location.href).pathname);
        } catch (error) {
            createPopup('error', 'Error saving the category');
        }
    };

    const handleDelete = async () => {
        if (!categoryId) return;

        try {
            await categoryService.delete(categoryId);
            createPopup('success', 'Category deleted successfully');
            navigate("/admin");
        } catch (error) {
            createPopup('error', 'Error deleting the category');
        }
    };

    const handleTranslationChange = (languageId: string, field: keyof CategoryTranslation, value: string) => {
        setTranslations(prevTranslations => ({
            ...prevTranslations,
            [languageId]: {
                ...prevTranslations[languageId],
                [field]: value
            }
        }));
    };

    const handleAddTranslation = () => {
        if (languageSelector.current && languageSelector.current.value) {
            const newLanguageId = languageSelector.current.value;
            setTranslations(prevTranslations => ({
                ...prevTranslations,
                [newLanguageId]: {
                    name: ""
                }
            }));
        }
    };

    const handleRemoveTranslation = (languageId: string) => {
        setTranslations(prevTranslations => {
            const newTranslations = { ...prevTranslations };
            delete newTranslations[languageId];
            return newTranslations;
        });
    };

    return (
        <div className='form'>
            <h2>{categoryId ? 'Modify Category' : 'Create Category'}</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Id:</label>
                    <input type="text" value={id} onChange={(e) => setId(e.target.value)} />
                </div>
                <div>
                    <label>Media URL:</label>
                    <input type="text" value={mediaUrl} onChange={(e) => setMediaUrl(e.target.value)} />
                </div>
                <div>
                    <label>Parent Category:</label>
                    <select value={parentCategoryId} onChange={(e) => setParentCategoryId(e.target.value)}>
                        <option value=""><Translate translationKey={'gui.category.select'} /></option>
                        {categories.map(category => (
                            <option key={category.id} value={category.id!}><Translate translationKey='name' dataSet={category.translations} /></option>
                        ))}
                    </select>
                </div>
                <div>
                    <fieldset>
                        <legend>Translations:</legend>
                        <div className='translations'>
                            {Object.entries(translations).map(([languageId, translation], key) => (
                                <legend key={key}>
                                    <legend>Language: {languageId}</legend>
                                    <label>Name:</label>
                                    <input type="text" value={translation.name || ""} onChange={(e) => handleTranslationChange(languageId, 'name', e.target.value)} />
                                    <button type="button" onClick={() => handleRemoveTranslation(languageId)}>Remove</button>
                                </legend>
                            ))}
                        </div>
                        <select name="languages" ref={languageSelector}>
                            {languages.filter(lang => !Object.keys(translations).includes(lang.id)).map((lang, key) => (
                                <option key={key} value={lang.id}>{lang.id}</option>
                            ))}
                        </select>
                        <button type="button" onClick={handleAddTranslation}>Add</button>
                    </fieldset>
                </div>
                <button type="submit">{categoryId ? 'Modify' : 'Create'}</button>
                {categoryId && (
                    <button type="button" onClick={handleDelete} style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white' }}>
                        Delete
                    </button>
                )}
            </form>
        </div>
    );
};

export default CategoryForm;
