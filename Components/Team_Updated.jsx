import React from "react";
import {
  TiSocialFacebook,
  TiSocialTwitter,
  TiSocialLinkedin,
  TiSocialInstagram,
  TiSocialGithub,
} from "react-icons/ti";

const teamMembers = [
  {
    id: 1,
    name: "Michael Johnson",
    role: "Lead Developer & Blockchain Engineer",
    bio: "Expert in Solidity, smart contracts, and blockchain architecture with 5+ years of experience.",
    image: "img_01.png",
  },
  {
    id: 2,
    name: "Sarah Williams",
    role: "Full Stack Developer",
    bio: "Specialized in React, Web3 integration, and creating responsive DApp interfaces.",
    image: "img_02.png",
  },
  {
    id: 3,
    name: "David Chen",
    role: "Smart Contract Auditor",
    bio: "Security expert focused on smart contract testing, auditing, and vulnerability assessment.",
    image: "img_03.png",
  },
  {
    id: 4,
    name: "Emma Davis",
    role: "UI/UX Designer",
    bio: "Creative designer specializing in crypto platforms and decentralized application interfaces.",
    image: "img_04.png",
  },
  {
    id: 5,
    name: "James Wilson",
    role: "DevOps & Infrastructure",
    bio: "Infrastructure expert managing deployment, scaling, and system reliability.",
    image: "img_01.png",
  },
  {
    id: 6,
    name: "Lisa Martinez",
    role: "Project Manager",
    bio: "Experienced project manager ensuring on-time delivery and team coordination.",
    image: "img_02.png",
  },
];

const Team = () => {
  return (
    <section id="team" className="team pos-rel pt-140 pb-150">
      <div className="container">
        <div className="sec-title text-center mb-70">
          <h5 className="sec-title__subtitle">Our Team</h5>
          <h2 className="sec-title__title">Meet our skilled team</h2>
          <p className="team__description">
            Experienced professionals dedicated to building a secure and innovative blockchain platform
          </p>
        </div>

        <div className="team__wrap ul_li">
          {teamMembers.map((member) => (
            <div className="team__item wow fadeInUp" key={member.id} data-wow-delay={`${member.id * 100}ms`}>
              <div className="avatar">
                <img src={`assets/img/team/${member.image}`} alt={member.name} />
              </div>
              <div className="team__info text-center mb-20">
                <h3>{member.name}</h3>
                <span className="team__role">{member.role}</span>
                <p className="team__bio">{member.bio}</p>
              </div>

              <div className="team__social ul_li_center">
                <ul className="team__social-link link-left ul_li">
                  <li>
                    <a href="#" title="Facebook">
                      <TiSocialFacebook />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="GitHub">
                      <TiSocialGithub />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Instagram">
                      <TiSocialInstagram />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="LinkedIn">
                      <TiSocialLinkedin />
                    </a>
                  </li>
                  <li>
                    <a href="#" title="Twitter">
                      <TiSocialTwitter />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="team__shape">
        <div className="shape shape-1">
          <img src="assets/img/shape/t_shape1.png" alt="" />
        </div>
        <div className="shape shape-2">
          <img src="assets/img/shape/t_shape2.png" alt="" />
        </div>
      </div>
    </section>
  );
};

export default Team;
