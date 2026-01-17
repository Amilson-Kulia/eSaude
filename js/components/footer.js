class CustomFooter extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                footer {
                    background-color: var(--text-color);
                    color: var(--white);
                    padding: 3rem 2rem;
                }
                
                .footer-container {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }
                
                .footer-logo {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .footer-logo img {
                    height: 40px;
                    margin-right: 10px;
                }
                
                .footer-logo-text {
                    font-size: 1.5rem;
                    font-weight: bold;
                    color: var(--white);
                }
                
                .footer-about p {
                    opacity: 0.8;
                    margin-bottom: 1rem;
                }
                
                .social-links {
                    display: flex;
                    gap: 1rem;
                }
                
                .social-links a {
                    color: var(--white);
                    background-color: rgba(255, 255, 255, 0.1);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: var(--transition);
                }
                
                .social-links a:hover {
                    background-color: var(--primary-color);
                    transform: translateY(-3px);
                }
                
                .footer-links h3, .footer-contact h3 {
                    font-size: 1.2rem;
                    margin-bottom: 1.5rem;
                    position: relative;
                }
                
                .footer-links h3::after, .footer-contact h3::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    width: 50px;
                    height: 2px;
                    background-color: var(--primary-color);
                }
                
                .footer-links ul {
                    list-style: none;
                }
                
                .footer-links li {
                    margin-bottom: 0.8rem;
                }
                
                .footer-links a {
                    color: rgba(255, 255, 255, 0.8);
                    text-decoration: none;
                    transition: var(--transition);
                }
                
                .footer-links a:hover {
                    color: var(--white);
                    padding-left: 5px;
                }
                
                .contact-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 1rem;
                }
                
                .contact-item i {
                    margin-right: 10px;
                    color: var(--primary-color);
                }
                
                .copyright {
                    text-align: center;
                    padding-top: 2rem;
                    margin-top: 2rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    opacity: 0.7;
                }
                
                @media (max-width: 768px) {
                    .footer-container {
                        grid-template-columns: 1fr;
                    }
                }
            </style>
            
            <footer>
                <div class="footer-container">
                    <div class="footer-about">
                        <div class="footer-logo">
                            <img src="./img/icos/health_care_hands_doctor_heart_icon_233072.ico" alt="eSaúde Logo">
                            <span class="footer-logo-text">eSaúde</span>
                        </div>
                        <p>Sistema de marcação de consultas para postos de saúde em Angola, facilitando o acesso à saúde pública.</p>
                        <div class="social-links">
                            <a href="#"><i data-feather="facebook"></i></a>
                            <a href="#"><i data-feather="twitter"></i></a>
                            <a href="#"><i data-feather="instagram"></i></a>
                            <a href="#"><i data-feather="linkedin"></i></a>
                        </div>
                    </div>
                    
                    <div class="footer-links">
                        <h3>Links Rápidos</h3>
                        <ul>
                            <li><a href="index.html">Início</a></li>
                            <li><a href="sobre.html">Sobre</a></li>
                            <li><a href="services.html">Dicas de Saúde</a></li>
                            <li><a href="postos.html">Postos de Saúde</a></li>
                            
                        </ul>
                    </div>
                    
                    <div class="footer-contact">
                        <h3>Contato</h3>
                        <div class="contact-item">
                            <i data-feather="map-pin"></i>
                            <span>Luanda, Angola</span>
                        </div>
                        <div class="contact-item">
                            <i data-feather="mail"></i>
                            <span>contato@eSaúde.ao</span>
                        </div>
                        <div class="contact-item">
                            <i data-feather="phone"></i>
                            <span>+244 942 560 850</span>
                        </div>
                    </div>
                </div>
                
                <div class="copyright">
                    <p>&copy; <span class="current-year">2025</span> eSaúde Angola. Todos os direitos reservados.</p>
                </div>
            </footer>
        `;
    }
}

customElements.define('custom-footer', CustomFooter);