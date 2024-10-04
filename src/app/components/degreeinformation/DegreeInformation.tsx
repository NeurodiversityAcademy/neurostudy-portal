import React, { useEffect, useState } from 'react'; 
import { CourseDetailsProps } from '../../interfaces/Course'; 
// 根据实际路径替换 
const DegreeInformation: React.FC = () => { const [degrees, setDegrees] = useState<CourseDetailsProps[]>([]); 
// 使用 useEffect 来加载 degreeData.json 数据 
useEffect(() => { fetch('../..//coursedetail/courseData.json').then(response => response.json()).then(data => setDegrees(data.courses)).catch(error => console.error('Error fetching data:', error)); }, []); 

// 替换为实际的 JSON 文件路径 



return ( <div> 
    <h1>Degree Information</h1> 
    {degrees.length > 0 ? ( degrees.map((degree) => ( 
        <div > 
            <p><strong>Overview:</strong> {degree.Overview}</p> 
            <p><strong>Structure:</strong> {degree.Structure}</p> 
            <p><strong>EntryRequirements:</strong> {degree.EntryRequirements}</p> 
            <p><strong>TuitionsAndFees:</strong> {degree.TuitionsAndFees}</p> 
            <p><strong>CareerOpportunities:</strong> {degree.CareerOpportunities}</p> 
            <p><strong>PreviousCredits:</strong> {degree.PreviousCredits}</p> 
            <p><strong>KeyCodes:</strong> {degree.KeyCodes}</p> 
            <p><strong>AboutUniversity:</strong> {degree.AboutUniversity}</p> 
            <p><strong>FAQS:</strong> {degree.FAQS}</p> 
    </div> )) ) : ( <p>Loading degree information...</p> )} </div> ); }; 
export default DegreeInformation;