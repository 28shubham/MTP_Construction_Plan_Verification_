import React, { useState } from "react";
import "./VerificationForm.css"; // Assuming you have styles for this component
import Navbar from "./components/Navbar"; // Import Navbar component

function VerificationForm() {
  const [formData, setFormData] = useState({
    plotSize: "",
    minimumSetback: "",
    groundCoverage: "",
    floorAreaRatio: "",
    plinthLevel: "",
    maxHeight: "",
    maxStoreys: "",
    habitableRoom: "",
    kitchen: "",
    bathroom: "",
    waterCloset: "",
    combinedBathWC: "",
    store: "",
    garage: "",
    singleOccupancyServantRoom: "",
    lightVentilation: "",
    ventilationShaft: "",
    interiorCourtyard: "",
    verandah: "",
    staircaseWidth: "",
    staircaseTread: "",
    staircaseRiser: "",
    staircaseHeadHeight: "",
    constructionInBackCourtyard: "",
    lift: "",
    mumty: "",
    servicesInTerrace: "",
    gate: "",
    boundaryWall: "",
    basement: "",
    ramp: "",
    parkingSpace: "",
    allowableProjection: "",
    allowableBalcony: "",
    rainWaterHarvesting: "",
    solarWaterHeating: "",
    solarPhotoVoltaic: "",
    flushingSystem: "",
    parapetRailing: "",
    minimumPassage: "",
    amalgamationFragmentation: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Data Submitted:", formData);
  };

  return (
    <div className="my">
      <div className="mynew">
        <Navbar />
      </div>
      <div className="verification-form-container">
        <h2>Construction Plan Verification Form for Studio Apartment</h2>
        <form onSubmit={handleSubmit} className="verification-form">
          <label>
            Plot Size (sq.m):
            <select
              name="plotSize"
              value={formData.plotSize}
              onChange={handleChange}
            >
              <option value="">Select Plot Size</option>
              <option value="Minimum 60 to 100">Minimum 60 to 100</option>
              <option value="Above 100 to 150">Above 100 to 150</option>
              <option value="Above 150 to 250">Above 150 to 250</option>
              <option value="Above 250 to 350">Above 250 to 350</option>
              <option value="Above 350 to 450">Above 350 to 450</option>
              <option value="Above 450">Above 450</option>
            </select>
          </label>

          <label>
            Minimum Setback Required:
            <input
              type="text"
              name="minimumSetback"
              value={formData.minimumSetback}
              onChange={handleChange}
              placeholder="e.g., 0.70 x Plot Area"
            />
          </label>

          <label>
            Ground Coverage (Max Permissible):
            <input
              type="text"
              name="groundCoverage"
              value={formData.groundCoverage}
              onChange={handleChange}
              placeholder="e.g., 0.70 x Plot Area"
            />
          </label>

          <label>
            Floor Area Ratio (Max Permissible):
            <input
              type="text"
              name="floorAreaRatio"
              value={formData.floorAreaRatio}
              onChange={handleChange}
              placeholder="e.g., 2.1 x Plot Area"
            />
          </label>

          <label>
            Plinth Level:
            <input
              type="text"
              name="plinthLevel"
              value={formData.plinthLevel}
              onChange={handleChange}
              placeholder="e.g., 900mm"
            />
          </label>

          <label>
            Maximum Height (from Plinth Level):
            <input
              type="text"
              name="maxHeight"
              value={formData.maxHeight}
              onChange={handleChange}
              placeholder="e.g., 11m"
            />
          </label>

          <label>
            Maximum Number of Storeys Allowed:
            <input
              type="text"
              name="maxStoreys"
              value={formData.maxStoreys}
              onChange={handleChange}
              placeholder="e.g., Ground + 2 Floors"
            />
          </label>

          <label>
            Habitable Room (Min. Area):
            <input
              type="text"
              name="habitableRoom"
              value={formData.habitableRoom}
              onChange={handleChange}
              placeholder="e.g., 9.5 sq.m"
            />
          </label>

          <label>
            Kitchen (Min. Area):
            <input
              type="text"
              name="kitchen"
              value={formData.kitchen}
              onChange={handleChange}
              placeholder="e.g., 5 sq.m"
            />
          </label>

          <label>
            Bathroom (Min. Area):
            <input
              type="text"
              name="bathroom"
              value={formData.bathroom}
              onChange={handleChange}
              placeholder="e.g., 1.8 sq.m"
            />
          </label>

          <label>
            Water Closet (W.C.) (Min. Area):
            <input
              type="text"
              name="waterCloset"
              value={formData.waterCloset}
              onChange={handleChange}
              placeholder="e.g., 1.2 sq.m"
            />
          </label>

          <label>
            Combined Bath and W.C. (Min. Area):
            <input
              type="text"
              name="combinedBathWC"
              value={formData.combinedBathWC}
              onChange={handleChange}
              placeholder="e.g., 2.8 sq.m"
            />
          </label>

          <label>
            Store (Min. Area):
            <input
              type="text"
              name="store"
              value={formData.store}
              onChange={handleChange}
              placeholder="e.g., 3 sq.m"
            />
          </label>

          <label>
            Garage (Min. Area):
            <input
              type="text"
              name="garage"
              value={formData.garage}
              onChange={handleChange}
              placeholder="e.g., 18 sq.m"
            />
          </label>

          <label>
            Single Occupancy Servant Room (Min. Area):
            <input
              type="text"
              name="singleOccupancyServantRoom"
              value={formData.singleOccupancyServantRoom}
              onChange={handleChange}
              placeholder="e.g., 7.5 sq.m"
            />
          </label>

          <label>
            Light and Ventilation:
            <input
              type="text"
              name="lightVentilation"
              value={formData.lightVentilation}
              onChange={handleChange}
              placeholder="e.g., Openings to external air"
            />
          </label>

          <label>
            Ventilation Shaft Size (Min. one dimension):
            <input
              type="text"
              name="ventilationShaft"
              value={formData.ventilationShaft}
              onChange={handleChange}
              placeholder="e.g., 1.2 sq.m"
            />
          </label>

          <label>
            Interior Courtyard (Min. Width):
            <input
              type="text"
              name="interiorCourtyard"
              value={formData.interiorCourtyard}
              onChange={handleChange}
              placeholder="e.g., 2.4m"
            />
          </label>

          <label>
            Verandah for Light & Ventilation (Min. Width):
            <input
              type="text"
              name="verandah"
              value={formData.verandah}
              onChange={handleChange}
              placeholder="e.g., 2.4m"
            />
          </label>

          <label>
            Staircase Width:
            <input
              type="text"
              name="staircaseWidth"
              value={formData.staircaseWidth}
              onChange={handleChange}
              placeholder="e.g., 900mm"
            />
          </label>

          <label>
            Staircase Tread:
            <input
              type="text"
              name="staircaseTread"
              value={formData.staircaseTread}
              onChange={handleChange}
              placeholder="e.g., 250mm"
            />
          </label>

          <label>
            Staircase Riser:
            <input
              type="text"
              name="staircaseRiser"
              value={formData.staircaseRiser}
              onChange={handleChange}
              placeholder="e.g., 190mm"
            />
          </label>

          <label>
            Staircase Clear Head Height:
            <input
              type="text"
              name="staircaseHeadHeight"
              value={formData.staircaseHeadHeight}
              onChange={handleChange}
              placeholder="e.g., 2200mm"
            />
          </label>

          <label>
            Construction in Back Courtyard:
            <input
              type="text"
              name="constructionInBackCourtyard"
              value={formData.constructionInBackCourtyard}
              onChange={handleChange}
              placeholder="e.g., Not allowed"
            />
          </label>

          <label>
            Lift (If Applicable):
            <input
              type="text"
              name="lift"
              value={formData.lift}
              onChange={handleChange}
              placeholder="e.g., For building above 4 storeys"
            />
          </label>

          <label>
            Mumty (If Applicable):
            <input
              type="text"
              name="mumty"
              value={formData.mumty}
              onChange={handleChange}
              placeholder="e.g., 1m x 1m"
            />
          </label>

          <label>
            Services in Terrace (If Applicable):
            <input
              type="text"
              name="servicesInTerrace"
              value={formData.servicesInTerrace}
              onChange={handleChange}
              placeholder="e.g., Permissible for specific purposes"
            />
          </label>

          <label>
            Gate Width (Min. Width):
            <input
              type="text"
              name="gate"
              value={formData.gate}
              onChange={handleChange}
              placeholder="e.g., 3m"
            />
          </label>

          <label>
            Boundary Wall (Height):
            <input
              type="text"
              name="boundaryWall"
              value={formData.boundaryWall}
              onChange={handleChange}
              placeholder="e.g., 1.8m"
            />
          </label>

          <label>
            Basement (If Applicable):
            <input
              type="text"
              name="basement"
              value={formData.basement}
              onChange={handleChange}
              placeholder="e.g., Allowed for parking"
            />
          </label>

          <label>
            Ramp (For Disabled Access):
            <input
              type="text"
              name="ramp"
              value={formData.ramp}
              onChange={handleChange}
              placeholder="e.g., 1:12 slope"
            />
          </label>

          <label>
            Parking Space (Min. Area):
            <input
              type="text"
              name="parkingSpace"
              value={formData.parkingSpace}
              onChange={handleChange}
              placeholder="e.g., 12 sq.m per car"
            />
          </label>

          <label>
            Allowable Projection (If Applicable):
            <input
              type="text"
              name="allowableProjection"
              value={formData.allowableProjection}
              onChange={handleChange}
              placeholder="e.g., 1m"
            />
          </label>

          <label>
            Allowable Balcony (If Applicable):
            <input
              type="text"
              name="allowableBalcony"
              value={formData.allowableBalcony}
              onChange={handleChange}
              placeholder="e.g., 1m x 2m"
            />
          </label>

          <label>
            Rain Water Harvesting System (If Applicable):
            <input
              type="text"
              name="rainWaterHarvesting"
              value={formData.rainWaterHarvesting}
              onChange={handleChange}
              placeholder="e.g., Mandatory"
            />
          </label>

          <label>
            Solar Water Heating System (If Applicable):
            <input
              type="text"
              name="solarWaterHeating"
              value={formData.solarWaterHeating}
              onChange={handleChange}
              placeholder="e.g., Optional"
            />
          </label>

          <label>
            Solar Photo Voltaic Panels (If Applicable):
            <input
              type="text"
              name="solarPhotoVoltaic"
              value={formData.solarPhotoVoltaic}
              onChange={handleChange}
              placeholder="e.g., Optional"
            />
          </label>

          <label>
            Flushing System (If Applicable):
            <input
              type="text"
              name="flushingSystem"
              value={formData.flushingSystem}
              onChange={handleChange}
              placeholder="e.g., Water or Manual"
            />
          </label>

          <label>
            Parapet Railing (Height):
            <input
              type="text"
              name="parapetRailing"
              value={formData.parapetRailing}
              onChange={handleChange}
              placeholder="e.g., 1m"
            />
          </label>

          <label>
            Minimum Passage Width (If Applicable):
            <input
              type="text"
              name="minimumPassage"
              value={formData.minimumPassage}
              onChange={handleChange}
              placeholder="e.g., 1.2m"
            />
          </label>

          <label>
            Amalgamation / Fragmentation of Plots (If Applicable):
            <input
              type="text"
              name="amalgamationFragmentation"
              value={formData.amalgamationFragmentation}
              onChange={handleChange}
              placeholder="e.g., Permitted with conditions"
            />
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default VSH;
