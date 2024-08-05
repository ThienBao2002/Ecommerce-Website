import React, { Component } from 'react';
import counter from "../../../data/counter.json";

class Counter extends Component {
    render() {
        return (
            <div className="hm-section pt-0">
                <div className="container">
                    <div className="row">
                        {/* Data */}
                        {counter.map((item, i) => (
                            <div className="col-lg-3 col-md-6" key={i}>
                                <div className="hm-icon">
                                    <span className="hm-icon-number">0{1 + i}</span>
                                    <i className={item.icon} />
                                    <div className="hm-icon-content">
                                        <h4>{item.title} <span className="hm-text-primary">.</span> </h4>
                                        <p className="text-disabled">{item.text}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* Data */}
                    </div>
                </div>
            </div>
        );
    }
}

export default Counter;