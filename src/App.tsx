import React, { useState } from 'react';
import algoliasearch from 'algoliasearch/lite';
import fallbackImage from './assets/no-logo.png';
import fallbackAvatarImage from './assets/missing-avatar.jpeg';
import InfoModal from './Modal_Info';
import ExportModal from './Modal_Export';

import {
  Configure,
  Highlight,
  Hits,
  InstantSearch,
  Pagination,
  SearchBox,
  RefinementList,
  CurrentRefinements,
  HierarchicalMenu,
  Stats,
  SortBy
} from 'react-instantsearch';


import type { Hit } from 'instantsearch.js';
import './App.css';
import { isTemplateHead } from 'typescript';

const apiUrl = 'https://us-central1-networking-9a9e0.cloudfunctions.net/api';

const searchClient = algoliasearch(
  'ZHOLL9EY2M',
  'b39326e3c65034fe48499f781b3ce613'
);

// const searchClient = {
//   search(requests) {
//     return fetch(`${apiUrl}/search`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ requests }),
//     })
//       .then(response => response.json())
//       .then(data => {
//         return {
//           results: data.results,
//         };
//       });
//   },
//   searchForFacetValues(requests) {
//     return fetch(`${apiUrl}/sffv`, {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify({ requests }),
//     }).then(res => res.json());
//   }
// };

function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    function (txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }
  );
}

const transformItems = (items) => {
  return items.map((item) => ({
    ...item,
    label: item.label.replace(/_/g, ' '),
  }));
};

const future = { preserveSharedStateOnUnmount: true };

export function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const openExportModal = () => {
    setIsExportModalOpen(true);
  }

  const closeTheModal = () => {
    localStorage.setItem('alreadySeenModal', 'yes');
    setIsModalOpen(false);
  };

  try {
    setTimeout(() => {
      const alreadySeenModal = localStorage.getItem('alreadySeenModal') || 'no';
      if (alreadySeenModal === 'no') {
        setIsModalOpen(true);
      }
    }, 1000);
  } catch (err) {
    console.log('Small error')
  }

  return (
    <div>
      <InstantSearch
        searchClient={searchClient}
        indexName="Unicorns"
        future={future}
        routing={true}
      >
        <header className="header">
          <h1 className="header-title">
            Networking Tools
            <Stats />
          </h1>
          {/* <button className="btn btn-sm btn-outline-dark avatar-btn headerBtn" onClick={openModal}>
            Startup Use Cases!
          </button> */}
        </header>

        <div className="container-fluid">

          <ExportModal
            isOpen={isExportModalOpen}
            onRequestClose={() => setIsExportModalOpen(false)}
          />

          <InfoModal
            isOpen={isModalOpen}
            onRequestClose={() => closeTheModal()}
          />

          <Configure hitsPerPage={25} />
          <div className="row">
            <div className="col-3 d-none d-md-block d-lg-block">
              <div className="filter-el">
                <h4>
                  Industry
                </h4>
                <RefinementList attribute="Industry" showMore="true" searchable="true" searchablePlaceholder="Enter a name..." limit="5" />
              </div>
              <div className="filter-el">
                <h4>
                  Founders
                </h4>
                <RefinementList attribute="Founders" showMore="true" searchable="true" searchablePlaceholder="Enter a name..." limit="5" />
              </div>
              <div className="filter-el">
                <h4>
                  Degree
                </h4>
                <RefinementList attribute="DegreeStudied" showMore="true" searchable="true" searchablePlaceholder="Enter a degree..." limit="5" />
              </div>
              <div className="filter-el">
                <h4>
                  Ethnicity
                </h4>
                <RefinementList attribute="Ethnicity" showMore="true" searchable="true" searchablePlaceholder="Enter a Ethnicity..." limit="5" />
              </div>
              <div className="filter-el">
                <h4>
                  SeedInvestors
                </h4>
                <RefinementList attribute="SeedInvestors" showMore="true" searchable="true" searchablePlaceholder="Enter a Investor..." limit="5" />
              </div>
              <div className="filter-el">
                <h4>
                  Universities
                </h4>
                <RefinementList attribute="Universities" showMore="true" searchable="true" searchablePlaceholder="Enter a tag..." limit="5" />
              </div>
            </div>
            <div className="col-md-9">
              <div className="row">
                <div className="col-12">
                  <SearchBox placeholder="What do you want to know..." className="searchbox" />
                  <CurrentRefinements />
                </div>
                <div className="col-3">
                  {/* <button className="btn btn-outline-dark" onClick={openExportModal}>
                    Export?
                  </button> */}
                </div>
              </div>
              <Hits hitComponent={Hit} />
              <br />
              <Pagination padding={2} />
              <br />
            </div>
            <div className="col-md-5 d-none">
              <div className="right-panel text-center">

                <a href="https://www.linkedin.com/in/dr-craig-n-horning-ph-d-41735410/" target="_blank">
                  <img src="https://media.licdn.com/dms/image/C4D03AQHzjOieBG0a-w/profile-displayphoto-shrink_800_800/0/1618580779268?e=1721260800&amp;v=beta&amp;t=YsfM-VcNIWL3NyiK7CFMq-suONaOJlyHZHbdcbJ0iLA" width="300px;" className=" img-thumbnail" />
                </a>

                <h3>
                  Ron Deman
                </h3>
                <p>
                  CEO & Co-Founder
                </p>
                <p>
                  New Startup LLC
                </p>
                <p>
                  Business Development Manager at Vention | Startup Partnerships | Venture
                  Scout | Helping Founders Engineer Products and Sell Them
                </p>
                <textarea className="form-control">
                  Enter a summary...
                </textarea>
                <br />
                <textarea className="form-control">
                  Tags
                </textarea>
              </div>
            </div>
          </div>
        </div>
      </InstantSearch>
    </div>
  );
}

type HitProps = {
  hit: Hit;
};

function ImageWithFallback({ hit, alt, classname, ...props }) {
  const handleError = (e) => {
    e.target.src = fallbackImage;
  };

  // const src = `https://less-code.twic.pics/networking-book/${hit.objectID}.jpeg`;
  const src = hit.ProfilePicture;
  return <img src={src} className={classname} alt={alt} onError={handleError} {...props} />;
}

function AvatarWithFallback({ src, alt, classname, ...props }) {
  const handleError = (e) => {
    e.target.src = fallbackAvatarImage;
  };

  return <img src={src || ''} width="80" className={classname} onError={handleError} {...props} />;
}

const YearsBetween = ({ year }) => {
  const currentYear = new Date().getFullYear();
  const yearsBetween = currentYear - year;

  return <span>{yearsBetween} years</span>;
};

function Hit({ hit }: HitProps) {
  return (
    <article>
      <div className="row">
        <div className="col-7">
          <h4>
            <Highlight attribute="Company" hit={hit} />
          </h4>
          <p>
            {hit.CompanyDescription}
          </p>
        </div>
        <div className="col-5">
          <table className="table table-sm table-striped">
            <tbody>
              {(hit.Founders || []).map((item, index) => (
                <tr>
                  <th key={index}className="text-end">
                    Founder #{index + 1}:
                  </th>
                  <td>
                  {item}
                </td>
              </tr>
              ))}
              <tr>
                <th width="40%" className="text-end">
                  Industry:
                </th>
                <td>
                  {hit.NumberOfFounders}
                </td>
              </tr>
              <tr>
                <th className="text-end">
                  # Of Founders:
                </th>
                <td>
                  {hit.NumberOfFounders || '--'}
                </td>
              </tr>
              <tr>
                <th className="text-end">
                  Founded:
                </th>
                <td>
                  {hit.YearFounded || '--'} (Yr to U: {hit.YrsToUnicorn})
                </td>
              </tr>
              <tr>
                <th className="text-end">
                  Elite_Employer:
                </th>
                <td>
                  {hit.Elite_Employer || '--'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <div className="m-2">
            Degrees:<br/>
            {(hit.DegreeStudied || []).map((item, index) => (
              <span key={index} className="badge bg-secondary me-1">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="col-3">
          <div className="m-2">
            Universities:<br/>
            {(hit.Universities || []).map((item, index) => (
              <span key={index} className="badge bg-secondary me-1">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="col-3">
          <div className="m-2">
            Ethnicity:<br/>
            {(hit.Ethnicity || []).map((item, index) => (
              <span key={index} className="badge bg-secondary me-1">
                {item}
              </span>
            ))}
          </div>
        </div>
        <div className="col-3">
          <div className="m-2">
            Seed Investors:<br/>
            {(hit.SeedInvestors || []).map((item, index) => (
              <span key={index} className="badge bg-secondary me-1">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </article>
  );
}
