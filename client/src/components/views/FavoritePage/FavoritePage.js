import React,{useEffect, useState} from 'react'
import './favorite.css'
import Axios from 'axios'
import { Popover } from 'antd';
import {IMAGE_BASE_URL} from '../../Config';

function FavoritePage() {
    const [FavoriteMovies, setFavoriteMovies] = useState([])
    useEffect(() => {
        fetchFavoriteMovie()
    }, [])

    const fetchFavoriteMovie = () =>{
        Axios.post('/api/favorite/getFavoriteMovie',{ userFrom: sessionStorage.getItem('userId')})
            .then(res=>{
                if(res.data.success){
                    console.log(res.data)
                    setFavoriteMovies(res.data.favorites)
                } else{
                    alert('정보를 가져오는데 실패했습니다.')
                }
            })
    }
    const onClickDelete = (movieId, userFrom) =>{
        const variables = {
            movieId,
            userFrom
        }
        Axios.post('/api/favorite/removeFromFavorite', variables)
        .then(res=>{
            if(res.data.success){
                fetchFavoriteMovie()
            } else{
                alert('리스트에서 지우는데 실패했습니다.')
            }
        })
    }

    const renderCards = FavoriteMovies.map((favorite, index) =>{
        const content = (
            <div>
                {favorite.moviePost ? 
                    <img src={`${IMAGE_BASE_URL}w500${favorite.moviePost}`} /> : "NO Image"    
            }
            </div>
        )
        return (
        <tr key={index}>
            <Popover content={content} title={`${favorite.movieTitle}`}>
            <td>{favorite.movieTitle}</td>
            </Popover>

            <td>{favorite.movieRunTime} mins</td>
            <td><button onClick={()=>onClickDelete(favorite.movieId, favorite.userFrom)}>Remove</button></td>
        </tr>
        )
    })

    return (
        <div style={{width:'85%', margin:'3rem auto'}}>
            <h2>Favorite Movies</h2>
            <hr/>

            <table>
                <thead>
                    <tr>
                        <th>Movie Title</th>
                        <th>Movie RunTime</th>
                        <td>Remove from favorites</td>
                    </tr>
                </thead>
                <tbody>
                    {renderCards}
                </tbody>
            </table>
            
        </div>
    )
}

export default FavoritePage
