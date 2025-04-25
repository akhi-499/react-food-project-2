import React from "react";
import logo from '../image/vit.png'
import Food from "../../../component/foodimage";
import '../footer/footer.css'
import { useHistory } from "react-router-dom";
import insta from '../image/instagram.png'
import whatsapp from '../image/whatsapp.png'
import linkedin from '../image/likedin.png'
import pintrest from '../image/pintrest.png'
import youtube from '../image/youtube.png'
import { Link } from "react-router-dom";
function Footer(){
    let Food1=Food.filter((ele)=>ele.titlename==='IndianFood');
    let Food2=Food.filter((ele)=>ele.titlename==='ItalianFood')
    let history=useHistory();
      function Alldish(titleId){
        history.push(`/alldish?id=${titleId}`)
    }
    return(
        <div className="footer">
              <img src={logo} className='flogo'></img>
              <div className="footer-main">
                <div>
                    <h4>Company</h4>
                    <ul>
                        <li>About us</li>
                        <li>Team</li>
                        <li>Help & Support</li>
                    </ul>
                </div>
                <div>
                    <h4>Pages</h4>
                    <ul>
                        <li><Link to={'/home'} className='linkto'>Home</Link></li>
                        <li> <Link to={'/cart'} className='linkto'>Cart</Link></li>
                        <li><Link to={'/profile'} className='linkto'>Profile</Link></li>
                    </ul>
                </div>
                
                <div>
                    <h4>Places</h4>
                    <ul>
                        <li>Nescafe</li>
                        <li>V-Lounge</li>
                        <li>CCD</li>
                    </ul>
                </div>
                <div>
                    <h4>Contact us</h4>
                    <a href="#"><img src={insta} className='footerimg' ></img></a>
                    <a href="#"><img src={whatsapp}  className='footerimg'></img></a>
                    <a href="#"><img src={pintrest} className='footerimg' ></img></a>
                    <a href="#"><img src={linkedin} className='footerimg' ></img></a>
                    <a href="#"><img src={youtube} className='footerimg' ></img></a>
                </div>
              
              </div>
              <p>Copyrights@2023</p>
        </div>
    )
}

export default Footer