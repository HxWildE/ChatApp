
import assets from '../assets/assets';
import { useState, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext.jsx';

const LoginPage = () => {

const [currState,setCurrState] = useState("Sign up")
const [fullName ,setFullName] = useState("")
const [email,setEmail] = useState("")
const [password,setPassword] = useState("")
const [bio, setBio] = useState("")
const [isDataSubmitted ,setisDataSubmitted] = useState(false)
const [acceptedTerms, setAcceptedTerms] = useState(false)

 const { login } = useContext(AuthContext)

const onSubmitHandler = async (event)=>{
  event.preventDefault();

  if(currState === "Sign up" && !isDataSubmitted){
        if (!acceptedTerms) return;
        setisDataSubmitted(true)
        return; 
  }

  await login(currState === "Sign up" ? "signup" : "login", {
    fullName,
    email,
    password,
    bio,
  });
}

  return (

    <div className='min-h-screen bg-slate-950 flex items-center
    justify-center gap-8 sm:justify-evenly max-sm:flex-col'>

{/* left */}
<img src={assets.logo_big} alt="Logo" className='w-56 md:w-80 lg:w-96 rounded-3xl shadow-2xl object-cover'/>

{/* right  */}
<form onSubmit={onSubmitHandler}
 className='bg-slate-900 border border-slate-800 text-slate-100 
p-8 flex flex-col gap-6 rounded-2xl shadow-2xl w-full max-w-md'>

  <h2 className='font-medium text-2xl flex justify-between items-center'>
    {currState}
    {isDataSubmitted && <img onClick={()=> setisDataSubmitted(false)}
            src={assets.arrow_icon} alt="" className='w-5 cursor-pointer'/>
    }
  </h2>

  {currState === "Sign up" && !isDataSubmitted && (
<input onChange={(e)=>setFullName(e.target.value)} value={fullName}
 type='text' className='p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400
  focus:outline-none focus:border-blue-500 transition-colors' placeholder='Full Name' required/>
)}

{!isDataSubmitted && (
<>
  <input onChange={(e)=>setEmail(e.target.value)} value={email}
   type = "email" placeholder='Email Address'
  required className='p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400
  focus:outline-none focus:border-blue-500 transition-colors'/>

   <input onChange={(e)=>setPassword(e.target.value)} value={password}
   type = "password" placeholder='Password'
  required className='p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400
  focus:outline-none focus:border-blue-500 transition-colors'/>
</>

)}

{currState === "Sign up" && isDataSubmitted && (
  <textarea onChange={(e)=>setBio(e.target.value)} value={bio}
   rows={4} className='p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-400
  focus:outline-none focus:border-blue-500 transition-colors' 
  placeholder='Provide a short bio...' required >

  </textarea>
  )
}

<button type='submit' className='py-3 bg-blue-600 hover:bg-blue-700 transition-colors
 text-white font-medium rounded-lg cursor-pointer shadow-md'>
  {currState === "Sign up" ? (isDataSubmitted ? "Create Account" : "Next") : "Login Now"}
</button>

<div className='flex items-center gap-2 text-sm 
text-slate-400'>
  <input type='checkbox' checked={acceptedTerms}
    onChange={(e) => setAcceptedTerms(e.target.checked)}
    required={currState === "Sign up"}/>
  <p> Agree to the terms of use & privacy policy.</p>
</div>

<div className='flex flex-col gap-2'>
  { currState === "Sign up"? (
    <p className = 'text-sm text-slate-400'> Already have an account? 
    <span  onClick={()=> { setCurrState("Login"); setisDataSubmitted(false); }} className='font-medium text-blue-500 hover:text-blue-400 cursor-pointer transition-colors ml-1'> 
      Login here
     </span></p>

  ):(

  <p className = 'text-sm text-slate-400'>Create an account? 
  <span onClick={()=> setCurrState("Sign up")} className='font-medium text-blue-500 hover:text-blue-400 cursor-pointer transition-colors ml-1'>Click here</span></p>
  )}

</div>

</form>    
    
</div>
  );
}

export default LoginPage