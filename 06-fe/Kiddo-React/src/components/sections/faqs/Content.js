import React, { Component } from 'react';
import Brands from './Brands';
import Testimonials from './Testimonials';
import faqs from "../../../data/faqs.json";
import { Accordion, Card, Button } from 'react-bootstrap';

class Content extends Component {
    render() {
        return (
            <div className="container">
                <div className="hm-section">
                    <div className="row">
                        <div className="col-lg-5">
                            <Accordion defaultActiveKey={1} className="faqaccordion">
                                {faqs.map((item, i) => (
                                    <Card key={i}>
                                        <Accordion.Collapse eventKey={1 + i} className="collapseparent">
                                            <Card.Body>
                                                <p>{item.text}</p>
                                            </Card.Body>
                                        </Accordion.Collapse>
                                        <Card.Header>
                                            <Accordion.Toggle as={Button} variant="link" eventKey={1 + i}>
                                                <h5 className="mb-0 hm-faq-title">{item.title}</h5>
                                            </Accordion.Toggle>
                                        </Card.Header>
                                    </Card>
                                ))}
                            </Accordion>
                        </div>
                        <div className="col-lg-7">
                            <div className="hm-faq-img">
                                <img src={process.env.PUBLIC_URL + "/assets/img/other/faq.jpg"} alt="faq" />
                            </div>
                        </div>
                    </div>
                </div>
                <Testimonials />
                <Brands />
            </div>
        );
    }
}

export default Content;