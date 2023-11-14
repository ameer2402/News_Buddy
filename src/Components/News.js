import React, { Component } from 'react'
import NewsComponent from './NewsComponent'
import Spinner from './Spinner';
import PropTypes from 'prop-types'


export class News extends Component {
    static defaultProps={
     country:'in',
     pagesize:8,
     category:'general'
    }
    static propTypes={
        country:PropTypes.string,
        pagesize:PropTypes.number,
        // category:PropTypes.string
    }
   
    capitalizeFirstLetter=(string)=>{
        return string.charAt(0).toUpperCase()+string.slice(1);
    }
    constructor(props){
        super(props); 
        
        this.state={
            articles:[],
            loading:false,
            page:1,
           
        }
        document.title=`${this.capitalizeFirstLetter(this.props.category)}-NewsMonkey`;
    }

    async updateNews(){
        const { setProgress } = this.props;
        setProgress(10);
        let url=`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=ebf4f25b57da4f23a34283963f154a16&page=${this.state.page -1}&pagesize=${this.props.pagesize}`;
        this.setState({loading:true});
        let data=await fetch(url);
        let parseddata=await data.json()
        console.log(parseddata);
        this.setState({articles: parseddata.articles,
        loading:false
        })
        setProgress(100);
    }
    
    async componentDidMount () {
        this.updateNews();
    }

    handlenext=async()=>{
        this.setState({page:this.state.page+1});
        this.updateNews();
        }
    
    handleprevious=async()=>{
        this.setState({page:this.state.page-1});
        this.updateNews();
        
    }
  render() {
    return (
        <>
      <div className='container '>
         <h1 className='text-center my-2' >Top Headlines-on {this.capitalizeFirstLetter(this.props.category)}</h1>
          {this.state.loading &&<Spinner/>}
          <div className="row my-2">
            {this.state.articles.map((element)=>{
                 return  <div className="col-md-4" key={element.url} >
                   <NewsComponent  title={element.title?element.title.slice(0,40):""} description={element.description?element.description.slice(0,50):""} imageUrl={element.urlToImage} newsUrl={element.url}
                   author={element.author} date={element.publishedAt} source={element.source.name}/>
                   </div>
            })}
           
           
          </div>
       
        
         </div>
         <div className="container d-flex justify-content-between">
         <button type="button"  disabled={this.state.page<=1} className="btn btn-dark" onClick={this.handleprevious}>&larr; Previous</button>
         <button type="button"  disabled={this.state.page+1>Math.ceil(this.state.totalResults/this.props.pagesize)} className="btn btn-dark" onClick={this.handlenext}>Next &rarr;</button>
         </div>
         </>
         
    )
  }
}

export default News
