"use client"
import GlobalApi from '@/app/_utils/GlobalApi'
import React, { useEffect, useState } from 'react'
import DoctorDetail from '../_components/DoctorDetail';
import DoctorSuggestionList from '../_components/DoctorSuggestionList';

function Details({params}) {

  const [doctor,setDoctor]=useState();
  useEffect(()=>{
    getDoctorById();
  },[])
  const getDoctorById=()=>{
    console.log("Record ID:", params.recordId);
    GlobalApi.getDoctorById(params.recordId).then(resp=>{
      console.log("Doctor Detail");
      console.log(resp.data);
      setDoctor(resp.data);
    })
    .catch(error => {
      console.error("Error fetching doctor:", error);
    });
  }
  return (
    <div className='p-5 md:px-10'>
      <h2 className='font-bold text-[22px]'>Details</h2>

      <div className='grid grid-cols-1 lg:grid-cols-4 '>
        {/* Doctor Detail  */}
        <div className=' col-span-3'>
        {doctor&& <DoctorDetail doctor={doctor} />}
         
        </div>
        {/* Doctor Suggestion  */}
        <div>
          <DoctorSuggestionList/>
        </div>
      </div>
    </div>
  )
}

export default Details