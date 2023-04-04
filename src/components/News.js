import React, { Component } from 'react'
import Newsitems from './Newsitems'
import Spinner from './Spinner.js'
import PropTypes from 'prop-types'
import InfiniteScroll from "react-infinite-scroll-component";
export class News extends Component {
    static defaultProps = {
        country:'in',
        pageSize:4,
        category:'general'
      }
      static propTypes = {
        country: PropTypes.string,
        pageSize:PropTypes.number,
        categary:PropTypes.string
      }
    
      capitalizeFirstLetter = (string) => {
        return string.charAt(0).toUpperCase() + string.slice(1);
      }
    constructor(props){
        super(props);
        this.state= {
            articles: [],
            loading:true,
            page:1,
            totalResults:0
         
        }
    }
    async updateNews(){
      const url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=213549f9027c4f60ba947c8b915b965a&page=${this.state.page}&pageSize=${this.props.pageSize}`;
      this.setState({loading:true});
      let data = await fetch(url);
      let parsedData=await data.json()
      this.setState({articles:parsedData.articles,
        totalResults:parsedData.totalResults,
          loading:false,
        })
      
    }
    fetchMoreData =async () => {
     this.setState({page:this.state.page+1})
     const url =`https://newsapi.org/v2/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=213549f9027c4f60ba947c8b915b965a&page=${this.state.page}&pageSize=${this.props.pageSize}`;
     let data = await fetch(url);
     let parsedData=await data.json()
     
     this.setState({
      articles:this.state.articles.concat(parsedData.articles),
       totalResults:parsedData.totalResults,
        
       })
        }
   async componentDidMount(){
       this.updateNews();
    }
    handlePrevClick=async()=>{
      this.setState({page:this.state.page-1});
      this.updateNews();
    }
     handleNextClick= async()=>{
  this.setState({page:this.state.page+1});
  this.updateNews();
  }
  render() {
    return (
        <div>
        <h1 className="text-center"> Samachar-Top {this.capitalizeFirstLetter(this.props.category)} Headlines</h1>
             {this.state.loading && <Spinner/>}
             <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner/>}
        >       <div className="container">
                <div className="row">
                {this.state.articles.map((element)=>{
                     return <div className="col md-4" key={element.url}>
                     <Newsitems title={element.title?element.title:""} description={element.description?element.description:""} imgUrl={element.urlToImage} newsUrl={element.url}author={element.author} date={element.publishedAt}
                      source={element.source.name}/>
                    </div>
                }
                )
                }
                    </div>
              </div>
              </InfiniteScroll>
        </div>
    ) 
  }
}

export default News