import "./newHotel.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import { useState } from "react";
import { hotelInputs } from "../../formSource";
import UseFetch from "../../hooks/UseFetch";
import axios from "axios";

const NewHotel = () => {
  const [files, setFiles] = useState("");
  const [info,setInfo] = useState({})  //object ayitt store cheynm api vilikumbol
  const [rooms,setRooms] = useState([])

  const {data,loading,error}=UseFetch("/rooms")
  console.log(data)

  const handleChange=(e)=>{
    setInfo({...info, [e.target.id] : e.target.value})
    console.log("info is",info)
  }

  const handleSelect =(e) =>{
    const value = Array.from(e.target.selectedOptions, (option) => option.value);
    console.log(value)
    setRooms(value)
  }
  console.log("rooms",rooms)

  const handleClick= async(e)=>{
    e.preventDefault();
    console.log("file is",files)
    try{
      const list = await Promise.all(                                 //file ne rray kkn it in object so use Object.values
        Object.values(files).map( async(file)=>{
          const data = new FormData();
          data.append("file",file);
          data.append("upload_preset", "upload");

          const uploadRes=await axios.post("https://api.cloudinary.com/v1_1/albdev/image/upload",data);
          const {url}=uploadRes.data;
          return url;
      }))

      console.log("list is",list)
      const newHotel={
        ...info,
        rooms,
        photos:list
      }
      console.log("nwehotel is",newHotel)

      await axios.post("/hotels",newHotel)

    }catch(err){

    }

  }

  return (
    <div className="new">
      <Sidebar />
      <div className="newContainer">
        <Navbar />
        <div className="top">
          <h1>Add New Hotel</h1>
        </div>
        <div className="bottom">
          <div className="left">
            <img
              src={
                files
                  ? URL.createObjectURL(files[0])  // show only 0th img
                  : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
              }
              alt=""
            />
          </div>
          <div className="right">
            <form>
              <div className="formInput">
                <label htmlFor="file">
                  hotelImages: <DriveFolderUploadOutlinedIcon className="icon" />
                </label>
                <input
                  type="file"
                  id="file"
                  multiple
                  onChange={(e) => setFiles(e.target.files)}   //multiple file so no files[0]
                  style={{ display: "none" }}
                />
              </div>

              {hotelInputs.map((input) => (
                <div className="formInput" key={input.id}>
                  <label>{input.label}</label>
                  <input id={input.id} type={input.type} placeholder={input.placeholder} onChange={handleChange} />
                </div>
              ))}

              <div className="formInput">
                <label>Featured</label>
                <select id="featured" onChange={handleChange} >
                  <option value={false}>NO</option>
                  <option value={true}>YES</option>
                </select>
              </div>

              <div className="selectRooms">
                <label>Rooms</label>
                <select id="rooms" multiple onChange={handleSelect} >
                  {loading ? "loading" :
                  data && data.map(room=>(
                    <option value={room._id}>{room.title}</option>
                  ))}
                </select>
              </div>
              
              <button onClick={handleClick}>Send</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewHotel;
