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
        <h2>
          Construction Plan Verification Form for Residential Plots or Villas
        </h2>
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
              placeholder="meter"
            />
          </label>

          <label>
            Ground Coverage (Max Permissible):
            <input
              type="text"
              name="groundCoverage"
              value={formData.groundCoverage}
              onChange={handleChange}
              placeholder=" sq.m"
            />
          </label>

          <label>
            Floor Area Ratio (Max Permissible):
            <input
              type="text"
              name="floorAreaRatio"
              value={formData.floorAreaRatio}
              onChange={handleChange}
              placeholder="sq.m"
            />
          </label>

          <label>
            Plinth Level:
            <input
              type="text"
              name="plinthLevel"
              value={formData.plinthLevel}
              onChange={handleChange}
              placeholder="mm"
            />
          </label>

          <label>
            Maximum Height (from Plinth Level):
            <input
              type="text"
              name="maxHeight"
              value={formData.maxHeight}
              onChange={handleChange}
              placeholder="meter"
            />
          </label>

          <label>
            Maximum Number of Storeys Allowed:
            <input
              type="text"
              name="maxStoreys"
              value={formData.maxStoreys}
              onChange={handleChange}
              placeholder="max Ground + 2 Floors"
            />
          </label>

          <label>
            Habitable Room:
            <input
              type="text"
              name="habitableRoomArea"
              value={formData.habitableRoomArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="habitableRoomWidth"
              value={formData.habitableRoomWidth}
              onChange={handleChange}
              placeholder="Width (m)"
            />
            <input
              type="text"
              name="habitableRoomHeight"
              value={formData.habitableRoomHeight}
              onChange={handleChange}
              placeholder="Height (m)"
            />
          </label>

          <label>
            Kitchen:
            <input
              type="text"
              name="kitchenArea"
              value={formData.kitchenArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="kitchenWidth"
              value={formData.kitchenWidth}
              onChange={handleChange}
              placeholder="Width (m)"
            />
            <input
              type="text"
              name="kitchenHeight"
              value={formData.kitchenHeight}
              onChange={handleChange}
              placeholder="Height (m)"
            />
          </label>

          <label>
            Bathroom:
            <input
              type="text"
              name="bathroomArea"
              value={formData.bathroomArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="bathroomWidth"
              value={formData.bathroomWidth}
              onChange={handleChange}
              placeholder="Width (m)"
            />
            <input
              type="text"
              name="bathroomHeight"
              value={formData.bathroomHeight}
              onChange={handleChange}
              placeholder="Height (m)"
            />
          </label>

          <label>
            Water Closet (W.C.):
            <input
              type="text"
              name="waterClosetArea"
              value={formData.waterClosetArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="waterClosetWidth"
              value={formData.waterClosetWidth}
              onChange={handleChange}
              placeholder="Width (m)"
            />
            <input
              type="text"
              name="waterClosetHeight"
              value={formData.waterClosetHeight}
              onChange={handleChange}
              placeholder="Height (m)"
            />
          </label>

          <label>
            Combined Bath and W.C.:
            <input
              type="text"
              name="combinedBathWCArea"
              value={formData.combinedBathWCArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="combinedBathWCWidth"
              value={formData.combinedBathWCWidth}
              onChange={handleChange}
              placeholder="Width (m)"
            />
            <input
              type="text"
              name="combinedBathWCHeight"
              value={formData.combinedBathWCHeight}
              onChange={handleChange}
              placeholder="Height (m)"
            />
          </label>

          <label>
            Store:
            <input
              type="text"
              name="storeArea"
              value={formData.storeArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="storeWidth"
              value={formData.storeWidth}
              onChange={handleChange}
              placeholder="Width (m)"
            />
            <input
              type="text"
              name="storeHeight"
              value={formData.storeHeight}
              onChange={handleChange}
              placeholder="Height (m)"
            />
          </label>

          <label>
            Garage:
            <input
              type="text"
              name="garageArea"
              value={formData.garageArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="garageWidth"
              value={formData.garageWidth}
              onChange={handleChange}
              placeholder="Width (m)"
            />
            <input
              type="text"
              name="garageHeight"
              value={formData.garageHeight}
              onChange={handleChange}
              placeholder="Height (m)"
            />
          </label>

          <label>
            Single Occupancy Servant Room:
            <input
              type="text"
              name="singleOccupancyServantRoomArea"
              value={formData.singleOccupancyServantRoomArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="singleOccupancyServantRoomWidth"
              value={formData.singleOccupancyServantRoomWidth}
              onChange={handleChange}
              placeholder="Width (m)"
            />
            <input
              type="text"
              name="singleOccupancyServantRoomHeight"
              value={formData.singleOccupancyServantRoomHeight}
              onChange={handleChange}
              placeholder="Height (m)"
            />
          </label>

          <label>
            Light and Ventilation:
            <input
              type="text"
              name="lightVentilation"
              value={formData.lightVentilation}
              onChange={handleChange}
              placeholder=" sq.m"
            />
          </label>

          <label>
            Ventilation Shaft:
            <input
              type="text"
              name="ventilationShaftArea"
              value={formData.ventilationShaftArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="ventilationShaftMinDimension"
              value={formData.ventilationShaftMinDimension}
              onChange={handleChange}
              placeholder="Minimum Dimension (m)"
            />
            <input
              type="text"
              name="ventilationShaftBuildingHeight"
              value={formData.ventilationShaftBuildingHeight}
              onChange={handleChange}
              placeholder="Building Height (m)"
            />
          </label>

          <label>
            Interior Courtyard (Min. Width):
            <input
              type="text"
              name="ventilationShaftArea"
              value={formData.interiorCourtyardArea}
              onChange={handleChange}
              placeholder="Area (sq.m)"
            />
            <input
              type="text"
              name="interiorCourtyard"
              value={formData.interiorCourtyard}
              onChange={handleChange}
              placeholder="width (m)"
            />
          </label>

          <label>
            Verandah for Light & Ventilation:
            <input
              type="text"
              name="verandah"
              value={formData.verandah}
              onChange={handleChange}
              placeholder="width(m)"
            />
          </label>

          <label>
            Staircase Details:
            <input
              type="text"
              name="staircaseWidth"
              value={formData.staircaseWidth}
              onChange={handleChange}
              placeholder="Width (mm)"
            />
            <input
              type="text"
              name="staircaseTread"
              value={formData.staircaseTread}
              onChange={handleChange}
              placeholder="Tread (mm)"
            />
            <input
              type="text"
              name="staircaseRiser"
              value={formData.staircaseRiser}
              onChange={handleChange}
              placeholder="Riser (mm)"
            />
            <input
              type="text"
              name="staircaseHeadHeight"
              value={formData.staircaseHeadHeight}
              onChange={handleChange}
              placeholder="Clear Head Height (mm)"
            />
          </label>

          <label>
            Construction in Back Courtyard:
            <select
              name="constructionInBackCourtyard"
              value={formData.constructionInBackCourtyard}
              onChange={handleChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Lift:
            <select name="Lift" value={formData.Lift} onChange={handleChange}>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Mumty:
            <input
              type="text"
              name="mumty"
              value={formData.mumty}
              onChange={handleChange}
              placeholder="meter"
            />
          </label>

          <label>
            Services in Terrace:
            <select
              name="servicesInTerrace"
              value={formData.servicesInTerrace}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Solar Photo Voltaic installation">
                Solar Photo Voltaic installation
              </option>
              <option value="Water tank">Water tank</option>
              <option value="Rain water pipes">Rain water pipes</option>
              <option value="Terrace with drainage">
                Terrace with drainage
              </option>
              <option value="Mumty">Mumty</option>
              <option value="Machine room">Machine room</option>
              <option value="Screening parapet to hide services">
                Screening parapet to hide services
              </option>
            </select>
          </label>

          <label>
            Gate Width:
            <input
              type="text"
              name="gate"
              value={formData.gate}
              onChange={handleChange}
              placeholder="Width(m)"
            />
          </label>

          <label>
            Basement:
            <select
              name="basement"
              value={formData.basement}
              onChange={handleChange}
            >
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Boundary Wall height and Turning Radius:
            <div>
              <div style={{ marginBottom: "10px", color: "black" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    color: "black",
                  }}
                >
                  Front:{" "}
                </span>
                <input
                  type="text"
                  name="frontBoundaryWall"
                  value={formData.frontBoundaryWall}
                  onChange={handleChange}
                  placeholder="Height(meter)"
                  style={{ marginRight: "10px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    color: "black",
                  }}
                >
                  Rear:{" "}
                </span>
                <input
                  type="text"
                  name="rearBoundaryWall"
                  value={formData.rearBoundaryWall}
                  onChange={handleChange}
                  placeholder="Height (meter)"
                  style={{ marginRight: "10px" }}
                />
              </div>
              <div style={{ marginBottom: "10px" }}>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    color: "black",
                  }}
                >
                  Side:{" "}
                </span>
                <input
                  type="text"
                  name="sideBoundaryWall"
                  value={formData.sideBoundaryWall}
                  onChange={handleChange}
                  placeholder="Height (meter)"
                  style={{ marginRight: "10px" }}
                />
              </div>
              <div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    color: "black",
                  }}
                >
                  Minimum Turning Radius:{" "}
                </span>
                <input
                  type="text"
                  name="turningRadius"
                  value={formData.turningRadius}
                  onChange={handleChange}
                  placeholder="Degree"
                />
              </div>
            </div>
          </label>

          <label>
            Ramp (For Disabled Access):
            <select name="ramp" value={formData.ramp} onChange={handleChange}>
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>
          <label>
            Parking Space (Min. Area):
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    color: "black",
                  }}
                >
                  Number of Cars:{" "}
                </span>
                <select
                  name="numberOfCars"
                  value={formData.numberOfCars}
                  onChange={handleChange}
                  style={{ width: "80px" }}
                >
                  <option value="">Select</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
              <div>
                <span
                  style={{
                    fontSize: "14px",
                    fontWeight: "normal",
                    color: "black",
                  }}
                >
                  Number of Two-Wheelers:{" "}
                </span>
                <select
                  name="numberOfTwoWheelers"
                  value={formData.numberOfTwoWheelers}
                  onChange={handleChange}
                  style={{ width: "80px" }}
                >
                  <option value="">Select</option>
                  <option value="0">0</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </div>
            </div>
          </label>

          <label>
            Allowable Projection:
            <input
              type="text"
              name="allowableProjection"
              value={formData.allowableProjection}
              onChange={handleChange}
              placeholder="meter"
            />
          </label>

          <label>
            Allowable Balcony (If Applicable):
            <input
              type="text"
              name="allowableBalcony"
              value={formData.allowableBalcony}
              onChange={handleChange}
              placeholder="width(meter)"
            />
          </label>

          <label>
            Rain Water Harvesting System:
            <select
              name="rainWaterHarvesting"
              value={formData.rainWaterHarvesting}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Solar Water Heating System:
            <select
              name="solarWaterHeating"
              value={formData.solarWaterHeating}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Solar Photo Voltaic Panels:
            <input
              type="text"
              name="Plot Size"
              value={formData.solarPhotoVoltaicplotsize}
              onChange={handleChange}
              placeholder="sq.m"
            />
            <input
              type="text"
              name="Kilowatt Peak Solar Photovoltaic.c"
              value={formData.solarPhotoVoltaicKWpSPV}
              onChange={handleChange}
              placeholder="KWp"
            />
          </label>

          <label>
            Flushing System Dual Button:
            <select
              name="flushingSystem"
              value={formData.flushingSystem}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Parapet Railing (Height):
            <input
              type="text"
              name="parapetRailing"
              value={formData.parapetRailing}
              onChange={handleChange}
              placeholder="meter"
            />
          </label>

          <label>
            Minimum Passage Width:
            <input
              type="text"
              name="minimumPassage"
              value={formData.minimumPassage}
              onChange={handleChange}
              placeholder="meter"
            />
          </label>

          <label>
            Amalgamation of Plots:
            <select
              name="amalgamation"
              value={formData.amalgamation}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <label>
            Fragmentation of Plots:
            <select
              name="fragmentation"
              value={formData.fragmentation}
              onChange={handleChange}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
          </label>

          <button type="submit">Submit</button>
        </form>
      </div>
    </div>
  );
}

export default VerificationForm;
