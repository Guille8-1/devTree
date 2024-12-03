import {Request, Response} from 'express'
import slug from 'slug';
import User, { IUser } from "../models/User";
import { checkPassword, hashPassword } from '../utils/auth';
import { validationResult } from 'express-validator';
import { generateJWT } from '../utils/jwt';
import formidable from 'formidable'
import cloudinary from '../config/cloudinary';
import {v4 as uuid} from 'uuid'

declare global {
    namespace Express {
        interface Request {
            user?: IUser
        }
    }
}

export const createAccount = async (req:Request,res:Response)=>{

    const {email, password} = req.body
    const userExists = await User.findOne({email});

    if(userExists) {
        const error = new Error('Email existente');
        return res.status(409).json({error:error.message})
    }
    const handle = slug(req.body.handle,'')
    const handleExists = await User.findOne({handle})
    if(handleExists){
        const error = new Error('Usuario no disponible');
        return res.status(409).json({error:error.message})
    }

    const user = new User(req.body);
    user.password = await hashPassword(password);
    user.handle = handle

    user.save();

    res.status(201).send('Usuario Creado');
}

export const login = async (req:Request, res:Response) => {

    let errors = validationResult(req)
    if(!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }

    const {email, password} = req.body
    const userExists = await User.findOne({email});
    
    //email registered
    if(!userExists) {
        const error = new Error('Usuario no existe');
        return res.status(404).json({error:error.message})
    }
    
    //check password
    const passTrue = await checkPassword(password, userExists.password)

    if(!passTrue) {
        const error = new Error('Password Incorrecto');
        return res.status(401).json({error:error.message})
    }
    const token = generateJWT({id:userExists._id});

    res.send(token)
}

export const getUser = async (req: Request, res: Response) => {
    res.json(req.user)
}

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const { description, links } = req.body;
        const handle = slug(req.body.handle,'')
        const handleExists = await User.findOne({handle})

    if(handleExists  && handleExists.email !== req.user.email){
        const error = new Error('Usuario no disponible');
        return res.status(409).json({error:error.message})
    }

    req.user.description = description;
    req.user.handle = handle
    req.user.links = links

    await req.user.save()
    res.send('Usuario Actualizado')

    } catch (err) {
        const error = new Error('error')
        return res.status(500).json({error:error.message})
    }
}

export const uploadImage = async (req: Request, res: Response) => {
    const form = formidable({multiples:false})
    try {
        form.parse(req, (error, fields, files)=>{
            cloudinary.uploader.upload(files.file[0].filepath, {public_id: uuid()}, async function(error, result){
                if(error){
                    const error = new Error('error subiendo imagen')
                    return res.status(500).json({error:error.message})
                }
                if(result){
                    req.user.image = result.secure_url
                    await req.user.save()
                    res.json({image:result.secure_url})
                }
            })
        })

    } catch (err) {
        const error = new Error('error')
        return res.status(500).json({error:error.message})
    }
}