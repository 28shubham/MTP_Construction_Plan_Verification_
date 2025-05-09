import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  getBuildingRules,
  getCitiesAndPincodes,
} from "../services/buildingRuleService";
import Navbar from "./components/Navbar";
import { FaBook, FaCity, FaMapMarkerAlt, FaDownload } from "react-icons/fa";
import { toast } from "react-toastify";

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 80px auto 0;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #1a2a6c;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const FilterSection = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const Select = styled.select`
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
`;

const RulesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
`;

const RuleCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const BuildingRules = () => {
  const [rules, setRules] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rulesData, locationsData] = await Promise.all([
        getBuildingRules(),
        getCitiesAndPincodes(),
      ]);
      setRules(rulesData);
      setCities(locationsData.cities);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load building rules");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <PageContainer>
        <Header>
          <Title>
            <FaBook /> Building Rules
          </Title>
        </Header>

        <FilterSection>
          <Select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
          >
            <option value="">All Cities</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </Select>
        </FilterSection>

        {loading ? (
          <div>Loading building rules...</div>
        ) : (
          <RulesGrid>
            {rules.map((rule) => (
              <RuleCard key={rule._id}>
                <h3>
                  <FaCity /> {rule.cityName}
                </h3>
                <p>
                  <FaMapMarkerAlt /> Pincode: {rule.pincode}
                </p>
                <div>
                  {rule.rules.map((ruleItem, index) => (
                    <div key={index}>
                      <p>{ruleItem.description}</p>
                    </div>
                  ))}
                </div>
                {rule.documentPath && (
                  <button
                    onClick={() =>
                      window.open(`http://localhost:8080/${rule.documentPath}`)
                    }
                  >
                    <FaDownload /> Download Document
                  </button>
                )}
              </RuleCard>
            ))}
          </RulesGrid>
        )}
      </PageContainer>
    </>
  );
};

export default BuildingRules;
