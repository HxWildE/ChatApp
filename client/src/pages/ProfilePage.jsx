import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext.jsx';
import { ThemeContext } from '../../context/ThemeContext.jsx';

const ProfilePage = () => {

      const {authUser , updateProfile } = useContext(AuthContext);
 
const [selectedImg , setSelectedImg] = useState(null)
const navigate = useNavigate();
const [name,setName] = useState(authUser.fullName)
const [bio,setBio] = useState(authUser.bio)

const { font, setFont } = useContext(ThemeContext);
const fonts = ['Inter', 'Roboto', 'Poppins', 'System'];

const handleSubmit = async(e)=>{
  e.preventDefault();

  if(!selectedImg){
    await updateProfile({fullName: name, bio});
    navigate('/');
    return;
  }
  
  const reader = new FileReader();
  reader.readAsDataURL(selectedImg);
  reader.onload = async () => {
    const base64Image = reader.result;
    await updateProfile({profilePic : base64Image , fullName: name ,bio})
    navigate('/'); 
  }
}
  return (
    <div className='min-h-screen bg-slate-950 bg-no-repeat flex items-center
    justify-center'>
       
       <div className='w-5/6 max-w-2xl bg-slate-900 text-slate-200 
       border border-slate-800 flex items-center justify-between max-sm:flex-col-reverse
       rounded-2xl shadow-2xl'>

        <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
          <h3 className='text-xl font-medium mb-2'>Profile Details</h3>
          <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer hover:opacity-80 transition'>
            <input onChange={(e)=>setSelectedImg(e.target.files[0])} 
            type='file' id='avatar' accept='.png , .jpg , .jpeg' hidden/>
            <img src={selectedImg ? URL.createObjectURL(selectedImg): (authUser?.profilePic || assets.avatar_icon)}
                 alt='' className='w-14 h-14 rounded-full object-cover border border-slate-700 shadow-sm'/>
            <span className='text-sm text-slate-400 font-medium'>Upload profile image</span>
          </label>
          <input onChange={(e) =>setName(e.target.value)} value={name}
          type='text' required placeholder='Your Name' className='p-3 bg-slate-800 border
           border-slate-700 rounded-lg text-slate-100 placeholder-slate-500
  focus:outline-none focus:border-blue-500 transition-colors'/>

  <textarea onChange={(e) =>setBio(e.target.value)} value={bio}
  className='p-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500
  focus:outline-none focus:border-blue-500 transition-colors'
  placeholder='Write profile bio...' required rows={3}></textarea>

  <div className="flex flex-col gap-3 mt-2">
    <h3 className='text-sm text-slate-400 font-medium uppercase tracking-wider'>Appearance</h3>
    <div className='flex flex-wrap gap-2'>
      {fonts.map((f) => (
        <button
          key={f}
          type="button"
          onClick={() => setFont(f)}
          style={{ fontFamily: f === 'System' ? 'system-ui, sans-serif' : `"${f}", sans-serif` }}
          className={`py-2 px-4 rounded-lg text-sm transition-all duration-200 border ${
            font === f 
              ? 'bg-blue-600 border-blue-500 text-white shadow-md' 
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white'
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  </div>

  <button type='submit' className='py-3 bg-blue-600 hover:bg-blue-700 transition-colors
 text-white rounded-xl shadow-md cursor-pointer font-medium mt-4'>Save Profile</button>

    </form>
    <img className='max-w-48 w-48 h-48 aspect-square rounded-full mx-10 max-sm:mt-10 max-sm:mb-4 object-cover border-4 border-slate-800 shadow-xl' src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.logo_icon)} alt='Profile Preview'></img>
       </div>

    </div>
  )
}

export default ProfilePage