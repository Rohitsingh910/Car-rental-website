import React, { useEffect } from "react";

import carData from "../assets/data/carData";
import { Container, Row, Col } from "reactstrap";
import Helmet from "../components/Helmet/Helmet.jsx";
import { useParams } from "react-router-dom";
import BookingForm from "../components/UI/BookingForm";
import PaymentMethod from "../components/UI/PaymentMethod";

const CarDetails = () => {
  const { slug } = useParams();

  const singleCarItem = carData.find((item) => item.carName === slug);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [singleCarItem]);

  return (
    <Helmet title={singleCarItem.carName}>
      <section>
        <Container>
          <Row>
            <Col lg="6">
              <img src={singleCarItem.imgUrl} alt="" classnameName="w-100" />
            </Col>

            <Col lg="6">
              <div classnameName="car__info">
                <h2 classnameName="section__title">{singleCarItem.carName}</h2>

                <div classnameName=" d-flex align-items-center gap-5 mb-4 mt-3">
                  <h6 classnameName="rent__price fw-bold fs-4">
                    ${singleCarItem.price}.00 / Day
                  </h6>

                  <span classnameName=" d-flex align-items-center gap-2">
                    <span style={{ color: "#f9a826" }}>
                      <i classname="ri-star-s-fill"></i>
                      <i classname="ri-star-s-fill"></i>
                      <i classname="ri-star-s-fill"></i>
                      <i classname="ri-star-s-fill"></i>
                      <i classname="ri-star-s-fill"></i>
                    </span>
                    ({singleCarItem.rating} ratings)
                  </span>
                </div>

                <p classnameName="section__description">
                  {singleCarItem.description}
                </p>

                <div
                  classnameName=" d-flex align-items-center mt-3"
                  style={{ columnGap: "4rem" }}
                >
                  <span classnameName=" d-flex align-items-center gap-1 section__description">
                    <i
                      classname="ri-roadster-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.model}
                  </span>

                  <span classnameName=" d-flex align-items-center gap-1 section__description">
                    <i
                      classname="ri-settings-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.automatic}
                  </span>

                  <span classnameName=" d-flex align-items-center gap-1 section__description">
                    <i
                      classname="ri-timer-flash-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.speed}
                  </span>
                </div>

                <div
                  classnameName=" d-flex align-items-center mt-3"
                  style={{ columnGap: "2.8rem" }}
                >
                  <span classnameName=" d-flex align-items-center gap-1 section__description">
                    <i classname="ri-map-pin-line" style={{ color: "#f9a826" }}></i>{" "}
                    {singleCarItem.gps}
                  </span>

                  <span classnameName=" d-flex align-items-center gap-1 section__description">
                    <i
                      classname="ri-wheelchair-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.seatType}
                  </span>

                  <span classnameName=" d-flex align-items-center gap-1 section__description">
                    <i
                      classname="ri-building-2-line"
                      style={{ color: "#f9a826" }}
                    ></i>{" "}
                    {singleCarItem.brand}
                  </span>
                </div>
              </div>
            </Col>

            <Col lg="7" classnameName="mt-5">
              <div classnameName="booking-info mt-5">
                <h5 classnameName="mb-4 fw-bold ">Booking Information</h5>
                <BookingForm />
              </div>
            </Col>

            <Col lg="5" classnameName="mt-5">
              <div classnameName="payment__info mt-5">
                <h5 classnameName="mb-4 fw-bold ">Payment Information</h5>
                <PaymentMethod />
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </Helmet>
  );
};

export default CarDetails;
