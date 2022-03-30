import React from "react";
import { Time } from "../time/Time";
import { favouritesService } from "../../services/favouritesService";
import { visitedService } from "../../services/visitedService";
import { Notice } from "../notice/notice";
import days from "../../consts/days.json";
import { FavoriteIcon } from "../../components/icons/FavoriteIcon";
import { ReactComponent as NotVisitedIcon }  from "../../assets/icons/not-visited-icon.svg";
import { ReactComponent as VisitedIcon } from "../../assets/icons/visited-icon.svg";
import { ReactComponent as WebIcon } from "../../assets/icons/web-icon.svg";
import { ReactComponent as DiscordIcon } from "../../assets/icons/discord-icon.svg";
import { DateString } from "../date/Date";
import "./venue-profile.css";

class VenueProfile extends React.Component {

    constructor(props) {
        super();
        this.state = {
            isVisited: visitedService.isVisited(props.venue.id),
            isFavourite: favouritesService.isFavourite(props.venue.id)
        }
        this._onVisitedClick = this._onVisitedClick.bind(this);
        this._onFavoriteClick = this._onFavoriteClick.bind(this);
    }

    _onVisitedClick() {
        if (this.state.isVisited) visitedService.removeVisited(this.props.venue.id)
        else visitedService.setVisited(this.props.venue.id);

        this.setState({
            isVisited: !this.state.isVisited
        });
    }

    _onFavoriteClick() {
        if (this.state.isFavourite) favouritesService.removeFavourite(this.props.venue.id)
        else favouritesService.setFavourite(this.props.venue.id);
        
        this.setState({
            isFavourite: !this.state.isFavourite
        });
    }

    render() {
        const exceptions = this.props.venue.exceptions && this.props.venue.exceptions.filter(e => {
            const now = new Date();
            const exceptionEnd = new Date(e.end);
            return now < exceptionEnd;
        });

        return (
            <div className="venue-profile">

                <div className="venue-profile__banner" 
                     style={ this.props.venue.banner ? { backgroundImage: `url("${this.props.venue.banner}")` } : null }>

                    <div className="venue-profile__user-settings">
                        <button 
                            className={"venue-profile__favourite-button" + (this.state.isFavourite ? " venue-profile__favourite-button--favourited" : " venue-profile__favourite-button--not-favourited")}
                            onClick={this._onFavoriteClick}>
                            <FavoriteIcon lit={this.state.isFavourite} />
                            Favorite venue
                        </button>

                        <button 
                            className={"venue-profile__visited-button" + (this.state.isVisited ? " venue-profile__visited-button--visited" : " venue-profile__visited-button--not-visited")}
                            onClick={this._onVisitedClick}>
                            { this.state.isVisited ? <VisitedIcon /> : <NotVisitedIcon /> }
                            Visited
                        </button>
                    </div>
                    
                </div>

                <div className="venue-profile__details">
                    <div className="venue-profile__heading">
                        <h2>
                            { this.props.venue.name }
                        </h2>                
                        { this.props.venue.website && 
                            <a className="venue-profile__website" target="_blank" rel="noreferrer" href={this.props.venue.website}>
                                <WebIcon />
                            </a>
                        }
                        { this.props.venue.discord && 
                            <a className="venue-profile__discord" target="_blank" rel="noreferrer" href={this.props.venue.discord}>
                                <DiscordIcon />
                            </a>
                        }
                    </div>

                    <p className="venue-profile__location">
                        { this.props.venue.location }
                    </p>

                    { this.props.venue.notices?.map(n => 
                        <Notice summary={n} />
                    )}

                    <article className="venue-profile__description">
                        { this.props.venue.description && 
                            (
                                Array.isArray(this.props.venue.description) ? 
                                    this.props.venue.description.map(para => <p>{para}</p>) :
                                    <p>{this.props.venue.description}</p>
                            )
                        }
                    </article>
                    
                    { (this.props.venue.times && this.props.venue.times.length > 0) &&
                        <React.Fragment>
                            <table className="venue-profile__opening-times">
                                <tbody>
                                { this.props.venue.times.map((t, i) => 
                                    <tr key={i}>
                                        <td className="venue-profile__day"><strong>{days[t.day]}</strong></td> 
                                        <td className="venue-profile__start"><Time time={t.start} day={t.day} format24={false} /></td>
                                        <td className="venue-profile__split">{ t.end && <React.Fragment>-</React.Fragment> }</td>
                                        <td className="venue-profile__end">{ t.end && <Time time={t.end} day={t.day} format24={false} /> }</td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                            <small className="venue-profile__timezone-notice">All times are in <em>your</em> timezone.</small>
                        </React.Fragment>
                    }

                    { (exceptions && exceptions.length > 0) && 
                        <article className="venue-profile__exceptions">
                            <p>This venue will be closed at the following times:</p>
                            <table>
                                { this.props.venue.exceptions.map((e, i) => {
                                    const exceptionStart = new Date(e.start);
                                    const exceptionEnd = new Date(e.end);
                                    return (<tr key={i}>
                                        <td><DateString date={exceptionStart} /></td>
                                        <td className="venue-profile__split">{ <React.Fragment>-</React.Fragment> }</td>
                                        <td><DateString date={exceptionEnd} /></td>
                                    </tr>);
                                })}
                            </table>
                        </article>
                    }

                    { this.props.venue.photos &&
                        <div className="venue-profile_photos">
                            {this.props.venue.images.map(i => 
                                <img className="venue-profile__photo" src={i} alt={`Photograph of venue ${this.props.venue.name}.`} />
                                )}
                        </div>
                    }

                </div>
                
            </div>)
    }

}

export { VenueProfile };