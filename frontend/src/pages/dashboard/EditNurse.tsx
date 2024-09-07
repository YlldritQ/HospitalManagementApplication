import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getNurseById, updateNurse } from '../../services/nurseService';
import { CUNurseDto, NurseDto } from '../../types/nurseTypes';
import { toast } from 'react-toastify';

const EditNurse: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    
    const [nurse, setNurse] = useState<CUNurseDto>({
        firstName: '',
        lastName: '',
        gender: '',
        contactInfo: '',
        dateOfBirth: new Date(),
        dateHired: new Date(),
        qualifications: '',
        isAvailable: false,
        departmentId: 0,
        userId: '',
    });
    
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (id) {
            const fetchNurse = async () => {
                try {
                    const data: NurseDto = await getNurseById(Number(id));
                    setNurse({
                        firstName: data.firstName,
                        lastName: data.lastName,
                        gender: data.gender,
                        contactInfo: data.contactInfo,
                        dateOfBirth: new Date(data.dateOfBirth),
                        dateHired: new Date(data.dateHired),
                        qualifications: data.qualifications,
                        isAvailable: data.isAvailable,
                        departmentId: data.departmentId,
                        userId: data.userId,
                    });
                } catch (err) {
                    setError('Failed to fetch nurse details');
                } finally {
                    setLoading(false);
                }
            };

            fetchNurse();
        } else {
            // Handle case for adding a new nurse
            setLoading(false);
        }
    }, [id]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = event.target;
        
        if (type === 'checkbox') {
            setNurse(prevState => ({
                ...prevState,
                [name]: (event.target as HTMLInputElement).checked
            }));
        } else {
            setNurse(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const updatedNurse: CUNurseDto = {
            ...nurse,
            dateOfBirth: new Date(nurse.dateOfBirth),
            dateHired: new Date(nurse.dateHired),
        };

        try {
            if (id) {
                await updateNurse(Number(id), updatedNurse);
                toast.success('Nurse updated successfully');
            } else {
                // Handle new nurse creation
                // await createNurse(updatedNurse);
                toast.success('Nurse created successfully');
            }
            navigate('/nurse-list');
        } catch (err) {
            toast.error('Failed to save nurse');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div>
            <h1>{id ? 'Edit Nurse' : 'Add New Nurse'}</h1>
            <form onSubmit={handleSubmit}>
                {/* Form fields */}
            </form>
        </div>
    );
};

export default EditNurse;
