import React from 'react';
import { CardBody } from 'reactstrap';
import Slidewithindicator from './slidewithindicator';
import { WithIndicatorExample } from './UiCarouselCode';

const Banner = () => {
  return (
    <div style={{ marginBottom: "300px", padding: "80px", maxHeight:"500px" }}>
      <CardBody>
        <div className="live-preview" style={{ height: "100px" }}>
          <Slidewithindicator />
        </div>

        <div className="d-none code-view">
          <pre className="language-markup" style={{ height: "375px" }}>
            <code>
              <WithIndicatorExample />
            </code>
          </pre>
        </div>
      </CardBody>
    </div>
  );
}

export default Banner;
