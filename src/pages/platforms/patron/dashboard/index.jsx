import React from "react";
import { MDBContainer, MDBRow, MDBCol, MDBCard, MDBCardBody } from "mdbreact";

const PinoyIMDInfo = () => {
  return (
    <MDBContainer className="py-5">
      {/* Header */}
      <MDBRow>
        <MDBCol md="12">
          <h2 className="text-center mb-4 font-weight-bold">
            🩺 Pinoy iMD: Telehealth para sa Pilipino
          </h2>
          <p className="lead text-center">
            Isang makabagong platform para sa ligtas at mabilis na konsultasyong
            medikal.
          </p>
        </MDBCol>
      </MDBRow>

      {/* What is Pinoy iMD */}
      <MDBRow className="mt-4">
        <MDBCol md="6">
          <MDBCard className="shadow-sm">
            <MDBCardBody>
              <h4 className="font-weight-bold">Ano ang Pinoy iMD?</h4>
              <p>
                Ang <strong>Pinoy iMD</strong> ay isang{" "}
                <em>Telehealth platform</em> na nagbibigay ng access sa
                konsultasyon sa mga lisensyadong doktor kahit nasaan ka man.
              </p>
              <ul>
                <li>✅ Online Consultation</li>
                <li>✅ Electronic Health Records</li>
                <li>✅ Health Monitoring Tools</li>
                <li>✅ Secure Patient-Doctor Interaction</li>
              </ul>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>

        {/* Support from Subscribers */}
        <MDBCol md="6">
          <MDBCard className="shadow-sm">
            <MDBCardBody>
              <h4 className="font-weight-bold">
                Suporta mula sa mga Subscriber
              </h4>
              <p>
                Ang <strong>Pinoy iMD</strong> ay patuloy na tinatangkilik ng
                iba’t ibang healthcare providers sa bansa —{" "}
                <strong>tulad ng Alpha Med</strong> — bilang bahagi ng kanilang
                layunin na gamitin ang teknolohiya upang mapabuti ang serbisyong
                medikal.
              </p>
              <p>
                Sa pamamagitan ng platform, naipapatupad ng mga subscriber ang:
              </p>
              <ul>
                <li>📅 Mas madaling online appointment</li>
                <li>🏥 Konsultasyong medikal kahit nasa bahay</li>
                <li>📂 Electronic Medical Records na accessible anytime</li>
              </ul>
              <p>
                Ang kanilang pagsuporta ay patunay na handa na ang healthcare
                system ng Pilipinas sa isang makabagong direksyon.
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Powered by TechnoWiz */}
      <MDBRow className="mt-4">
        <MDBCol md="12">
          <MDBCard className="shadow-sm">
            <MDBCardBody>
              <h4 className="font-weight-bold">
                Powered by TechnoWiz Solution Provider
              </h4>
              <p>
                Ang <strong>TechnoWiz Solution Provider</strong> ang bumuo at
                nagpapatakbo ng Pinoy iMD, bilang isang cloud-based system na
                makabago at ligtas.
              </p>
              <ul>
                <li>💡 Locally developed</li>
                <li>💻 Cloud-based technology</li>
                <li>🔐 Secure & compliant</li>
                <li>🛠️ Continuous innovation</li>
              </ul>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Testimonial */}
      <MDBRow className="mt-4">
        <MDBCol md="12">
          <MDBCard className="shadow-sm">
            <MDBCardBody>
              <blockquote className="blockquote mb-0">
                <p>
                  "Sa tulong ng Pinoy iMD, mas naging mabilis at episyente ang
                  pag-aasikaso namin sa aming mga pasyente. Isang tunay na
                  partner sa modernong healthcare."
                </p>
                <footer className="blockquote-footer mt-2">
                  Alpha Med Representative{" "}
                  <cite title="Source Title">Subscriber</cite>
                </footer>
              </blockquote>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* Final Section: Symbolism */}
      <MDBRow className="mt-4">
        <MDBCol md="12">
          <MDBCard className="shadow-sm">
            <MDBCardBody>
              <h4 className="font-weight-bold">
                Isang Simbolo ng Suporta at Pagkakaisa
              </h4>
              <p>
                Ang pagsali ng mga healthcare providers tulad ng Alpha Med sa
                Pinoy iMD ay simbolo ng kanilang malasakit at dedikasyon sa
                pagbibigay ng abot-kayang serbisyong medikal sa makabagong
                paraan.
              </p>
              <p>
                <em>
                  Handa ka na rin bang sumabay sa digital health transformation?
                </em>
              </p>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>

      {/* CTA: Maging Subscriber */}
      <MDBRow className="mt-5 text-center">
        <MDBCol md="12">
          <MDBCard className="shadow-sm bg-light">
            <MDBCardBody>
              <h4 className="font-weight-bold mb-3">
                Interesado ka bang maging subscriber?
              </h4>
              <p className="mb-4">
                Gamitin ang Pinoy iMD para sa iyong klinika, ospital, o health
                facility. Sama-sama nating gawing makabago at abot-kaya ang
                serbisyong medikal.
              </p>
              <button
                className="btn btn-primary btn-lg"
                onClick={() => (window.location.href = "/contact")}
              >
                Maging Subscriber
              </button>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default PinoyIMDInfo;
