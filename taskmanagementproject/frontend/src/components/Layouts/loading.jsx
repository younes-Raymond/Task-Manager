import react from 'react'
import './loading.css'
const Loading = () => {

    return(
        <div className="loading_container">
        <div className='custom-loader'></div>
        <p>loading....</p>
        <p>please wait the data is loaded</p>
       </div>
    )
}

export default Loading