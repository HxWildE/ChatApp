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
    <div className='min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black flex items-center justify-center p-4'>
       
       <div className='w-full max-w-2xl bg-slate-900/60 backdrop-blur-2xl text-slate-200 
       border border-slate-800/50 flex flex-col items-center justify-center
       rounded-3xl shadow-2xl overflow-hidden relative'>
         
         {/* Top decorative gradient */}
         <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>

         {/* Header */}
         <div className='w-full p-8 pb-4 flex justify-between items-center border-b border-slate-800/50'>
             <h2 className='text-2xl font-semibold tracking-tight'>Edit Profile</h2>
             <button onClick={() => navigate('/')} className="text-slate-400 hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
               </svg>
             </button>
         </div>

        <form onSubmit={handleSubmit} className='flex flex-col gap-6 p-8 w-full'>
          
          <div className='flex flex-col sm:flex-row gap-8 items-center sm:items-start'>
            {/* Avatar Section */}
            <div className='flex flex-col items-center gap-4'>
              <div className='relative group'>
                <img className='w-32 h-32 aspect-square rounded-full object-cover border-4 border-slate-800 shadow-xl transition-transform group-hover:scale-105' 
                     src={selectedImg ? URL.createObjectURL(selectedImg) : (authUser?.profilePic || assets.avatar_icon)} 
                     alt='Profile Preview' />
                <label htmlFor='avatar' className='absolute bottom-0 right-0 bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-full cursor-pointer shadow-lg transition-colors'>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.414-1.414A1 1 0 0011.586 3H8.414a1 1 0 00-.707.293L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  <input onChange={(e)=>setSelectedImg(e.target.files[0])} type='file' id='avatar' accept='.png , .jpg , .jpeg' hidden/>
                </label>
              </div>
              <span className='text-xs text-slate-400 font-medium uppercase tracking-wider'>Profile Photo</span>
            </div>

            {/* Inputs Section */}
            <div className='flex flex-col gap-4 w-full'>
              <div className='space-y-1'>
                <label className='text-xs text-slate-400 font-medium uppercase tracking-wider ml-1'>Full Name</label>
                <input onChange={(e) =>setName(e.target.value)} value={name}
                  type='text' required placeholder='Your Name' 
                  className='w-full p-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-600
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all'/>
              </div>

              <div className='space-y-1'>
                <label className='text-xs text-slate-400 font-medium uppercase tracking-wider ml-1'>Bio</label>
                <textarea onChange={(e) =>setBio(e.target.value)} value={bio}
                  className='w-full p-3.5 bg-slate-950/50 border border-slate-700/50 rounded-xl text-slate-100 placeholder-slate-600
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none'
                  placeholder='Write something about yourself...' required rows={3}></textarea>
              </div>
            </div>
          </div>

          <hr className='border-slate-800/50 my-2'/>

          {/* Appearance Section */}
          <div className="flex flex-col gap-3">
            <h3 className='text-xs text-slate-400 font-medium uppercase tracking-wider ml-1'>App Font</h3>
            <div className='grid grid-cols-2 sm:grid-cols-4 gap-3'>
              {fonts.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFont(f)}
                  style={{ fontFamily: f === 'System' ? 'system-ui, sans-serif' : `"${f}", sans-serif` }}
                  className={`py-3 px-4 rounded-xl text-sm transition-all duration-200 border ${
                    font === f 
                      ? 'bg-blue-600/20 border-blue-500 text-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.1)]' 
                      : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <button type='submit' className='w-full py-3.5 mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 transition-all text-white rounded-xl shadow-[0_0_20px_rgba(79,70,229,0.3)] font-medium active:scale-[0.98]'>
             Save Changes
          </button>

        </form>
       </div>
    </div>
  )
}

export default ProfilePage