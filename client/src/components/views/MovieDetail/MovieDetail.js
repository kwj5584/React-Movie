import React, { useEffect, useState } from 'react'
import { API_KEY, API_URL, IMAGE_BASE_URL } from '../../Config'
import MainImage from '../LandingPage/Sections/MainImage';
import MovieInfo from './Sections/MovieInfo'
import GridCards from '../commons/GridCards'
import { Row } from 'antd'
import Favorite from './Sections/Favorite'

function MovieDetail(props) {
    let movieId = props.match.params.movieId;
    const [Movie, setMovie] = useState([])
    const [Casts, setCasts] = useState([])
    const [ActorToggle, setActorToggle] = useState(false)
    const [LoadingForMovie, setLoadingForMovie] = useState(true)
    const [LoadingForCasts, setLoadingForCasts] = useState(true)

    useEffect(()=>{
        let endpointInfo = `${API_URL}movie/${movieId}?api_key=${API_KEY}`

        fetch(endpointInfo)
        .then(res=>res.json())
        .then(res=>{
            setMovie(res)
            setLoadingForMovie(false)
        })

        let endpointCrew = `${API_URL}movie/${movieId}/credits?api_key=${API_KEY}`
        fetch(endpointCrew)
        .then(res=>res.json())
        .then(res=>{
            setCasts(res.cast)
        })
        setLoadingForCasts(false)
    },[])

    const toggleActorView = () =>{
        setActorToggle(!ActorToggle)
    }
    return (
        <div>
            {/* Header */}
            {!LoadingForMovie ? 
                <MainImage 
                    image={`${IMAGE_BASE_URL}w1280${Movie.backdrop_path}`}
                    title={Movie.original_title}
                    text={Movie.overview}  
                />
                : <div>loading ...</div>
            }
                
            {/* Body */}
            <div style={{width:'85%', margin:'1rem auto'}}>
                <div style={{display:'flex', justifyContent:'flex-end'}}>
                    <Favorite movieInfo={Movie} movieId={movieId} userFrom={sessionStorage.getItem("userId")} />
                </div>

                {/* Movie Info */}
                {!LoadingForMovie? 
                    <MovieInfo movie={Movie}/>
                    : <div>loading ...</div>
                }
                
                <br/>
                {/* Actors Grid */}
                {ActorToggle &&
                    <Row gutter={ [16,16] }>
                    { !LoadingForCasts ? Casts.map((cast, index) => (
                        <React.Fragment key = {index}>
                            <GridCards
                                image={cast.profile_path ? 
                                    `${IMAGE_BASE_URL}w500${cast.profile_path}` : null}
                                characterName={cast.name}
                            />
                        </React.Fragment>
                    )) : <div>loading ...</div> }
                </Row>
                }
                <div style={{display:'flex', justifyContent:'center', margin:'2rem'}}>
                    <button onClick={toggleActorView}>Toggle Actor View</button>

                </div>
            </div>
        </div>
    )
}

export default MovieDetail
