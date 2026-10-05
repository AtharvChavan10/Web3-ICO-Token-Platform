import React from "react";
import Reveal from "./Reveal";

const teamMembers = [
  ["AC", "Atharv Chavan", "Founder", "Leads the token sale, the contracts, and the public round."],
  ["NP", "Nikhil Parande", "Developer", "Wallet connection, the buy path, and the investor desk."],
  ["AY", "Aaditya Yadav", "Developer", "Sale contracts, deployment, and keeping the round online."],
  ["CN", "Chaitanya Naik", "Developer", "The sale page, the docs, and how the round reads."],
];

const Team = () => {
  return (
    <section id="team" className="team-band pos-rel">
      <div className="container">
        <Reveal>
          <div className="sec-title text-center mb-70">
            <h5 className="sec-title__subtitle">People</h5>
            <h2 className="sec-title__title">Atharv Chavan and the team</h2>
          </div>
        </Reveal>
        <div className="team-grid">
          {teamMembers.map(([initials, name, role, bio], index) => (
            <Reveal key={name} delay={index * 60}>
              <article className="member-card">
                <div className="member-card__avatar">{initials}</div>
                <h3>{name}</h3>
                <span>{role}</span>
                <p>{bio}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
