import {Link} from 'react-router-dom';
import { useForm } from 'react-hook-form';
import ErrorMessage from '../components/errorMessage';
import {isAxiosError} from 'axios';
import { toast } from 'sonner';
import api from '../config/axios';
import type {RegisterForm} from '../types'

const Register = () => {
    const initialValues : RegisterForm = {
        name: "",
        email: "",
        handle:"",
        password:"",
        password_confirmation:""
    }

    const {
        register,
        watch,
        handleSubmit,
        reset,
        formState:{errors}
    } = useForm({defaultValues: initialValues})
    const watchPassword = watch('password');

    const handleRegister = async (formData:RegisterForm) =>{

        try {
            const {data} = await api.post(`/auth/register`, formData)
            toast.success(data)

            reset();
        } catch (error) {
            if(isAxiosError(error) && error.response){
              const err = error.response.data.error
              toast.error(err)
            }
        }
    }
    return (
      <>
        <h4 className="text-4xl text-white font-bold">Crear Cuenta</h4>

        <form
          onSubmit={handleSubmit(handleRegister)}
          className="bg-white px-5 py-20 rounded-lg space-y-10 mt-10"
        >
          <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="name" className="text-2xl text-slate-500">
              Nombre
            </label>
            <input
              id="name"
              type="text"
              placeholder="Tu Nombre"
              className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
              {...register("name", {
                required: "El nombre es obligatorio",
              })}
            />

            {errors.name && <ErrorMessage>{errors.name.message}</ErrorMessage>}
          </div>
          <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="email" className="text-2xl text-slate-500">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              placeholder="Email de Registro"
              className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
              {...register("email", {
                required: "El email es obligatorio",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "Email no valido",
                },
              })}
            />
            {errors.email && (
              <ErrorMessage>{errors.email.message}</ErrorMessage>
            )}
          </div>
          <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="handle" className="text-2xl text-slate-500">
              Handle
            </label>
            <input
              id="handle"
              type="text"
              placeholder="Nombre de usuario: sin espacios"
              className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
              {...register("handle", {
                required: "El handle es obligatorio",
              })}
            />
            {errors.handle && (
              <ErrorMessage>{errors.handle.message}</ErrorMessage>
            )}
          </div>
          <div className="grid grid-cols-1 space-y-3">
            <label htmlFor="password" className="text-2xl text-slate-500">
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Password de Registro"
              className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
              {...register("password", {
                required: "El password es obligatorio",
                minLength: {
                  value: 8,
                  message: "password minimo de 8 characteres",
                },
              })}
            />
            {errors.password && (
              <ErrorMessage>{errors.password.message}</ErrorMessage>
            )}
          </div>

          <div className="grid grid-cols-1 space-y-3">
            <label
              htmlFor="password_confirmation"
              className="text-2xl text-slate-500"
            >
              Repetir Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="Repetir Password"
              className="bg-slate-100 border-none p-3 rounded-lg placeholder-slate-400"
              {...register("password_confirmation", {
                required: "Repetir password es obligatorio",
                validate: (value) =>
                  value === watchPassword || "Los passwords no coiciden",
              })}
            />
            {errors.password_confirmation && (
              <ErrorMessage>
                {errors.password_confirmation.message}
              </ErrorMessage>
            )}
          </div>

          <input
            type="submit"
            className="bg-cyan-400 p-3 text-lg w-full uppercase text-slate-600 rounded-lg font-bold cursor-pointer"
            value="Crear Cuenta"
          />
        </form>

        <nav className="mt-10">
          <Link
            className="text-center text-white text-lg block"
            to="/auth/login"
          >
            ya tienes una cuenta inicia sesion!
          </Link>
        </nav>
      </>
    );
}

export default Register