import React from "react";
import {useState,useEffect} from 'react'
import axios from 'axios'

function Mapp() {
    console.log("come to see me")

    const [title, settitle] = useState(null);
    const [url, seturl] = useState(null);
    const [flow, setflow] = useState(null);
    
    const baseurl='https://server-lm30.onrender.com'
    useEffect(() => {
        axios.get(`${baseurl}/api/news/1`).then(response=>{
            settitle(response.data.title)
            seturl(response.data.url)
            setflow(response.data.flow)
        })    
},    []);


    return (
        console.log(title),
        <>
            <a href="{url}"><h1>{title}</h1></a>
            <p>{flow}</p>
        </>
    )
}

export default Mapp