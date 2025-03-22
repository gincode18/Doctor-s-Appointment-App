const { default: axios } = require("axios");


const API_KEY=process.env.NEXT_PUBLIC_STRAPI_API_KEY;

const axiosClient=axios.create({
    baseURL:'http://localhost:1337/api',
    headers:{
        'Authorization':`Bearer ${API_KEY}`
    }
})

 const getCategory=()=>axiosClient.get('/categories?populate=*');

 const getDoctorList=()=>axiosClient.get('/doctors?populate=*')
 
 const getDoctorByCategory=(category)=>axiosClient.get('/doctors?filters[categories][Name][$in]='+category+"&populate=*")
 
 const getDoctorById=(docId)=>axiosClient.get(`/doctors?filters[documentId][$eq]=${docId}&populate=*`).then(resp => {
   if (resp.data.data && resp.data.data.length > 0) {
     return { data: resp.data.data[0] };
   }
   throw new Error('Doctor not found');
 }).catch(error => {
   console.error(`Error fetching doctor with documentId ${docId}:`, error);
   throw error;
 });

 const bookAppointment=(data)=>axiosClient.post('/appointments',data);
 
const getUserBookingList=(userEmail)=>axiosClient.get(`/appointments?filters[Email][$eq]=${userEmail}&populate[doctor][populate][image]=true`)

const deleteBooking=(id)=>axiosClient.delete('/appointments/'+id)
 
    const sendEmail=(data)=>axios.post('/api/sendEmail',data);
    export default{
    getCategory,
    getDoctorList,
    getDoctorByCategory,
    getDoctorById,
    bookAppointment,
    getUserBookingList,
    deleteBooking,
    sendEmail
}