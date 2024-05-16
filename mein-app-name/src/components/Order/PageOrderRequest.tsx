import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import "./PageOrderRequest.css";
import NavbarComponent from "../NavbarComponent";
import MapComponent from "./MapComponent";
import { createContract } from "../../backend/api";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import { Position } from "../../Resources";

export default function PageOrderRequest() {
  const [address, setAddress] = useState("Eingeben...");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [budget, setBudget] = useState(10000);
  const [range, setRange] = useState(1);
  const [verified, setVerified] = useState(false);
  const [showMap, setMap] = useState(false);
  const [contractId, setContractId] = useState(null);
  const [isCreatingContract, setIsCreatingContract] = useState(false);
  const [getPosition, setPosition] = useState<Position>()

  const params = useParams();
  const customerId = params.customerId;
  const navigate = useNavigate();


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Form submitted");
    await handleCreateContract();
  };

  const handleClickMap1 = () => {
    setMap(!showMap);  // Toggle zwischen Anzeigen und Verbergen der Karte
  };
   
  const handleSelectChange1 = (event: any) => {
    setService(event.target.value);
  };
  
 

  const jobTypes = [
    "Hausmeister",
    "Haushälter",
    "Gärtner",
    "Kindermädchen",
    "Koch",
    "Putzkraft",
    "Handwerker",
    "Elektriker",
    "Installateur",
    "Klempner",
    "Maler",
    "Schädlingsbekämpfer",
    "Tierpfleger",
    "Hausbetreuer",
    "Gassigeher",
    "Wäscher",
    "Einkäufer",
    "Caterer",
    "Personal Trainer",
    "Ernährungsberater",
    "Musiklehrer",
    "Babysitter",
    "Hauslehrer",
    "Chauffeur",
    "Reinigungskraft",
    "Schneider",
    "Organisator",
    "Tischler",
    "Möbelträger",
    "Hundetrainer",
    "Kammerjäger",
    "Fensterputzer",
    "Kammerzofen",
    "Hausdoktor",
    "Blumenpfleger",
    "Renovierer",
    "Fensterreiniger",
    "Gartenarbeiter",
    "Bügeler",
    "Bodenleger",
    "Hundepfleger",
    "Autobesorger",
  ];

  const handleClick = () => {
    if (showMap) {
      setMap(false);
    } else {
      setMap(true);
    }
  };



  const handleSelectChange = (event: any) => {
    const selectedJobType = event.target.value;
    setService(selectedJobType);
  };

  const handleAddressChange = (newAddress: string, Location: Position) => {
    setAddress(newAddress);
    setPosition(Location)
  };

  const handleCreateContract = async () => {
    setIsCreatingContract(true);
    console.log("Creating contract...");
    const contractData = {
      adress: address,
      jobType: service.toUpperCase(),
      description: description,
      payment: "PAYPAL",
      range: range,
      statusOrder: "PAID",
      customerId: customerId!,
      verified: verified,
      longitude: getPosition!.longitude,
      latitude: getPosition!.latitude,
      maxPayment: budget
    };

    console.log("Contract data:", contractData);

    try {
      const response = await createContract(contractData);
      console.log("Response from createContract:", response);
      if (response.contractId) {
        console.log('Vertrag erfolgreich erstellt:', response);
        navigate(`/customer/${customerId}/order/${response.contractId}`);
      } else {
        console.error('Fehler: Keine ContractID erhalten');
      }
    } catch (error) {
      console.error('Fehler beim Erstellen des Vertrags:', error);
    } finally {
      setIsCreatingContract(false);
    }
  };
  return (
    <div className="background-image">
      <NavbarComponent />
      <div className="Frame">
        <div className="container-frame3">
          <Form onSubmit={handleSubmit} style={{ color: "white", padding: "20px" }}>
            <Button onClick={handleClickMap1} variant="info">
              {showMap ? "Karte verbergen" : "Karte anzeigen"}
            </Button>
            {showMap && (
              <div className="map-container">
                <MapComponent onAddressChange={handleAddressChange} />
                <Button variant="light" onClick={() => setMap(false)}>OK</Button>
              </div>
            )}
            <Form.Group className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                required
                placeholder="Straße..."
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dienstleistung</Form.Label>
              <Form.Select value={service} onChange={handleSelectChange} required>
                <option value="">ServiceTyp wählen...</option>
                {jobTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Beschreibung</Form.Label>
              <Form.Control
                as="textarea"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Maximales Budget (€)</Form.Label>
              <Form.Control
                type="number"
                value={budget}
                onChange={(e) => setBudget(parseInt(e.target.value))}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Reichweite (km)</Form.Label>
              <Form.Control
                type="number"
                value={range}
                onChange={(e) => setRange(parseInt(e.target.value))}
              />
            </Form.Group>
            <Button className="button" type="submit" disabled={isCreatingContract}>
              {isCreatingContract ? 'Erstellt...' : 'Vertrag erstellen und suchen'}
            </Button>
          </Form>
        </div>
      </div>
    </div>
  );
};
  