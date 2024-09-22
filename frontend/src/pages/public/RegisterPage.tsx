import * as Yup from 'yup';
import { useForm } from 'react-hook-form';
import { IRegisterDto } from '../../types/auth.types';
import InputField from '../../components/general/InputField';
import { yupResolver } from '@hookform/resolvers/yup';
import useAuth from '../../hooks/useAuth.hook';
import Button from '../../components/general/Button';
import { toast } from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PATH_DASHBOARD, PATH_PUBLIC } from '../../routes/paths';
import { GenderEnum } from '../../types/auth.types';
import { TbActivityHeartbeat } from "react-icons/tb";

const RegisterPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) navigate(PATH_DASHBOARD.dashboard);
  }, [isAuthenticated, navigate]);

  const registerSchema = Yup.object().shape({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    userName: Yup.string().required('User Name is required'),
    gender: Yup.string().required('Gender is required'),
    email: Yup.string()
      .required('Email is required')
      .email('Input text must be a valid email'),
    password: Yup.string()
      .required('Password is required')
      .min(8, 'Password must be at least 8 characters'),
    address: Yup.string().required('Address Is required'),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<IRegisterDto>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      userName: '',
      gender: '',
      email: '',
      password: '',
      address: '',
    },
  });

  const onSubmitRegisterForm = async (data: IRegisterDto) => {
    try {
      setLoading(true);
      await register(data.firstName, data.lastName, data.userName, data.email, data.gender, data.password, data.address);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      const err = error as { data: string; status: number };
      const { status, data } = err;
      if (status === 400 || status === 409) {
        toast.error(data);
      } else {
        toast.error('An Error occurred. Please contact admins');
      }
    }
  };

  return (
    <div className='fixed inset-0 flex justify-center items-center bg-cover bg-center'>
      <div className='bg-white bg-opacity-60 shadow-lg rounded-lg p-4 w-96 max-h-[600px] overflow-y-auto'>
        {/* Logo Section */}
        <div className='flex flex-col items-center mb-4'>
          <div className='bg-blue-600 text-white w-16 h-16 flex justify-center items-center rounded-full'>
            <TbActivityHeartbeat className="text-white-400 w-12 h-12" />
          </div>
          <h1 className='mt-4 text-3xl font-bold text-blue-800'>Register</h1>
        </div>

        {/* Register Form */}
        <form onSubmit={handleSubmit(onSubmitRegisterForm)} className='grid grid-cols-2 gap-2'>
          <InputField control={control} label='First Name' inputName='firstName' error={errors.firstName?.message} />
          <InputField control={control} label='Last Name' inputName='lastName' error={errors.lastName?.message} />
          <InputField control={control} label='User Name' inputName='userName' error={errors.userName?.message} />
          <InputField control={control} label='Email' inputName='email' error={errors.email?.message} />
          <InputField
            control={control}
            label='Password'
            inputName='password'
            inputType='password'
            error={errors.password?.message}
          />
          <InputField control={control} label='Address' inputName='address' error={errors.address?.message} />

          {/* Gender Selection */}
          <InputField
            control={control}
            label='Gender'
            inputName='gender'
            error={errors.gender?.message}
            isSelect={true}
            options={[
              { value: GenderEnum.MALE, label: 'Male' },
              { value: GenderEnum.FEMALE, label: 'Female' },
            ]}
          />

          {/* Login Link */}
          <div className='col-span-2 flex justify-between items-center gap-4'>
            <span>Already Have an account?</span>
            <Link to={PATH_PUBLIC.login} className='text-blue-600 font-semibold hover:underline'>
              Log in
            </Link>
          </div>

          <div className='col-span-2 flex justify-center items-center gap-4 mt-6'>
            <Button variant='secondary' type='button' label='Reset' onClick={() => reset()} />
            <Button variant='primary' type='submit' label='Register' loading={loading} onClick={() => {}} />

          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
