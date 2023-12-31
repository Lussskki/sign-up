import express from 'express'
//development
import signale from 'signale'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
const router = express.Router()

//db path
import mongoose from '../mongodb/connection.js'
//user schema
import User from '../mongodb/models/schema.js'

//http:get method
router.get('/',async (req,res)=>{
    try{
        const users = await User.find()        
        res.status(200).json({message:users})
    }catch(err){
        signale.error(`Get: error- ${err}`)
        res.status(500).json({err:`Get: error- ${err}`})
    }
})
//http:add method, sign up 
router.post('/signup', async (req,res)=>{
    const { 
        username, 
        email, 
        password, 
        name, 
        lastname } = req.body
        //hash,salt
        const saltRounds = parseInt(process.env.SALT_ROUNDS)
        const hashedPassword = await bcrypt.hash(password,saltRounds) 
    try{ 
        const exisitingUser = await User.findOne({email})
    if(exisitingUser){
        return res.status(400).json({error: 'email already registered'})
    }  
    const newUser = new User({
        username,
        email,
        password: hashedPassword,
        name,
        lastname,
        
      }) 
        await newUser.save() 
        res.status(200).json({message:'Post: successfully registered'})
    }catch(err){
        signale.error(`Signup: error- ${err}`)
        res.status(500).json({err:`Signup: error- ${err}`})
    } 
    return
})
//http: update method
router.put('/signup/:id', async (req, res)=>{
        const {id} = req.params
        const { 
            username, 
            email, 
            password, 
            name, 
            lastname } = req.body
        const hashedPassword = await bcrypt.hash(password,10)     
    try{ 
        const user = await User.findByIdAndUpdate(id,{username,
            email,
            hashedPassword,
            name,
            lastname,
            email},
            {new: true})
        if (!user) {
        return res.status(404).json({ message: 'User not found' })
    } 
        await user.save()
        return res.status(200).json({message: 'Put: updated'})    
    }catch(err){
        signale.error(`Put: error-${err}`)
        res.status(500).json({message:`Put: error- ${err}`})
    }
})
//http: delete method
router.delete('/signup/:id', async (req, res)=>{
        const id = req.params.id
    try{
        const user = await User.findByIdAndDelete(id)
        res.status(200).json({message:'Delete: successfully'})
    }catch(err){
        signale.error(`Delete: error-${err}`)
        res.status(500).json({message:`Delete: error-${err}`})
        
    }
})  


export default router