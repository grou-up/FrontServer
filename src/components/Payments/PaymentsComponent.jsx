import { React } from "react";
import Banner1Component from "./Banner1Component"; // Banner1Component import
import MySunComponnent from "./MySunComponent"
import ItemComponent from "./ItemComponent"
import './../../styles/payments/PaymentsComponent.css'

const PaymentsComponets = () => {
    return (
        <div className="main-content">
            <Banner1Component />
            <div className="content">
                <MySunComponnent />
                <ItemComponent />
            </div>
        </div>
    );
};

export default PaymentsComponets;
