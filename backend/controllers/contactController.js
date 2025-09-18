const Contact = require('../models/Contact');
const { validationResult } = require('express-validator');
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

// Configuration de nodemailer
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: process.env.EMAIL_PORT || 587,
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'contact@sorbo.ingenierie.ci',
      pass: process.env.EMAIL_PASS || 'password'
    }
  });
};

// @desc    Créer un nouveau contact
// @route   POST /api/contact
// @access  Public
exports.createContact = async (req, res) => {
  // Vérifier les erreurs de validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Récupération des données du formulaire
    const contactData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      subject: req.body.subject,
      message: req.body.message
    };

    // Ajout des champs selon le sujet
    switch (req.body.subject) {
      case 'ingenierie':
        contactData.projectType = req.body['project-type'];
        contactData.projectDescription = req.body['project-description'];
        contactData.projectLocation = req.body['project-location'];
        contactData.projectBudget = req.body['project-budget'];
        contactData.projectDeadline = req.body['project-deadline'];
        break;
      
      case 'formation':
        contactData.formationType = req.body['formation-type'];
        contactData.formationParticipants = req.body['formation-participants'];
        contactData.formationStart = req.body['formation-start'];
        contactData.formationDuration = req.body['formation-duration'];
        contactData.formationLocation = req.body['formation-location'];
        break;
      
      case 'logiciel':
        contactData.softwareName = req.body['software-name'];
        contactData.softwareLicense = req.body['software-license'];
        contactData.softwareUsers = req.body['software-users'];
        contactData.softwareServices = req.body['software-services'] || [];
        contactData.softwareOS = req.body['software-os'];
        break;
      
      case 'carriere':
        contactData.careerPosition = req.body['career-position'];
        contactData.careerExperience = req.body['career-experience'];
        contactData.careerAvailability = req.body['career-availability'];
        
        // Gestion du CV si fourni
        if (req.file) {
          const uploadDir = path.join(__dirname, '../uploads/cv');
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          
          const fileName = `${Date.now()}-${req.file.originalname}`;
          const filePath = path.join(uploadDir, fileName);
          
          fs.writeFileSync(filePath, req.file.buffer);
          contactData.careerCV = `/uploads/cv/${fileName}`;
        }
        break;
    }

    // Création du contact dans la base de données
    const contact = await Contact.create(contactData);

    // Envoi d'email de confirmation
    try {
      const transporter = createTransporter();
      
      // Email au client
      await transporter.sendMail({
        from: `"Sorbo-Ingénierie" <${process.env.EMAIL_USER}>`,
        to: contactData.email,
        subject: 'Confirmation de votre demande',
        html: `
          <h2>Merci de nous avoir contacté, ${contactData.name}!</h2>
          <p>Nous avons bien reçu votre demande concernant <strong>${getSubjectText(contactData.subject)}</strong>.</p>
          <p>Notre équipe va étudier votre demande et vous répondra dans les plus brefs délais.</p>
          <p>Voici un récapitulatif de votre message:</p>
          <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #4CAF50;">
            ${generateEmailSummary(contactData)}
          </div>
          <p>Si vous avez des questions supplémentaires, n'hésitez pas à nous contacter.</p>
          <p>Cordialement,</p>
          <p>L'équipe Sorbo-Ingénierie</p>
        `
      });
      
      // Email à l'administrateur
      await transporter.sendMail({
        from: `"Formulaire de contact" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_ADMIN || 'contact@sorbo.ingenierie.ci',
        subject: `Nouvelle demande: ${getSubjectText(contactData.subject)}`,
        html: `
          <h2>Nouvelle demande de contact</h2>
          <p><strong>Sujet:</strong> ${getSubjectText(contactData.subject)}</p>
          <p><strong>De:</strong> ${contactData.name} (${contactData.email})</p>
          <div style="padding: 15px; background-color: #f9f9f9; border-left: 4px solid #2196F3;">
            ${generateEmailSummary(contactData)}
          </div>
          <p><a href="${process.env.ADMIN_URL || 'http://localhost:3000/admin'}/contacts/${contact._id}">Voir dans l'administration</a></p>
        `
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      // On continue malgré l'erreur d'email
    }

    res.status(201).json({
      success: true,
      message: 'Votre message a été envoyé avec succès',
      data: contact
    });
  } catch (error) {
    console.error('Erreur lors de la création du contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de l\'envoi du message',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Récupérer tous les contacts
// @route   GET /api/contact
// @access  Private
exports.getContacts = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    
    const total = await Contact.countDocuments();
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(startIndex)
      .limit(limit);
    
    res.status(200).json({
      success: true,
      count: contacts.length,
      total,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        perPage: limit
      },
      data: contacts
    });
  } catch (error) {
    console.error('Erreur lors de la récupération des contacts:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération des contacts',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Récupérer un contact par son ID
// @route   GET /api/contact/:id
// @access  Private
exports.getContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la récupération du contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Mettre à jour le statut d'un contact
// @route   PATCH /api/contact/:id/status
// @access  Private
exports.updateContactStatus = async (req, res) => {
  try {
    const { status } = req.body;
    
    if (!['nouveau', 'en_traitement', 'traite'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Statut invalide'
      });
    }
    
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }
    
    res.status(200).json({
      success: true,
      data: contact
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la mise à jour du statut',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// @desc    Supprimer un contact
// @route   DELETE /api/contact/:id
// @access  Private
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact non trouvé'
      });
    }
    
    // Suppression du CV si existe
    if (contact.careerCV) {
      const cvPath = path.join(__dirname, '..', contact.careerCV);
      if (fs.existsSync(cvPath)) {
        fs.unlinkSync(cvPath);
      }
    }
    
    await contact.remove();
    
    res.status(200).json({
      success: true,
      message: 'Contact supprimé avec succès'
    });
  } catch (error) {
    console.error('Erreur lors de la suppression du contact:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la suppression du contact',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fonctions utilitaires
function getSubjectText(subject) {
  const subjects = {
    'ingenierie': 'Projet d\'ingénierie',
    'formation': 'Formation',
    'logiciel': 'Logiciels',
    'carriere': 'Carrières',
    'autre': 'Autre sujet'
  };
  return subjects[subject] || subject;
}

function generateEmailSummary(data) {
  let summary = '';
  
  // Informations communes
  summary += `<p><strong>Nom:</strong> ${data.name}</p>`;
  summary += `<p><strong>Email:</strong> ${data.email}</p>`;
  if (data.phone) summary += `<p><strong>Téléphone:</strong> ${data.phone}</p>`;
  
  // Informations spécifiques selon le sujet
  switch (data.subject) {
    case 'ingenierie':
      if (data.projectType) summary += `<p><strong>Type de projet:</strong> ${data.projectType}</p>`;
      if (data.projectDescription) summary += `<p><strong>Description:</strong> ${data.projectDescription}</p>`;
      if (data.projectLocation) summary += `<p><strong>Localisation:</strong> ${data.projectLocation}</p>`;
      if (data.projectBudget) summary += `<p><strong>Budget:</strong> ${data.projectBudget}</p>`;
      if (data.projectDeadline) summary += `<p><strong>Délai souhaité:</strong> ${new Date(data.projectDeadline).toLocaleDateString('fr-FR')}</p>`;
      break;
      
    case 'formation':
      if (data.formationType) summary += `<p><strong>Type de formation:</strong> ${data.formationType}</p>`;
      if (data.formationParticipants) summary += `<p><strong>Participants:</strong> ${data.formationParticipants}</p>`;
      if (data.formationStart) summary += `<p><strong>Date souhaitée:</strong> ${new Date(data.formationStart).toLocaleDateString('fr-FR')}</p>`;
      if (data.formationDuration) summary += `<p><strong>Durée:</strong> ${data.formationDuration}</p>`;
      if (data.formationLocation) summary += `<p><strong>Lieu:</strong> ${data.formationLocation}</p>`;
      break;
      
    case 'logiciel':
      if (data.softwareName) summary += `<p><strong>Logiciel:</strong> ${data.softwareName}</p>`;
      if (data.softwareLicense) summary += `<p><strong>Type de licence:</strong> ${data.softwareLicense}</p>`;
      if (data.softwareUsers) summary += `<p><strong>Nombre d'utilisateurs:</strong> ${data.softwareUsers}</p>`;
      if (data.softwareServices && data.softwareServices.length > 0) summary += `<p><strong>Services requis:</strong> ${data.softwareServices.join(', ')}</p>`;
      if (data.softwareOS) summary += `<p><strong>Système d'exploitation:</strong> ${data.softwareOS}</p>`;
      break;
      
    case 'carriere':
      if (data.careerPosition) summary += `<p><strong>Poste recherché:</strong> ${data.careerPosition}</p>`;
      if (data.careerExperience) summary += `<p><strong>Expérience:</strong> ${data.careerExperience}</p>`;
      if (data.careerAvailability) summary += `<p><strong>Disponibilité:</strong> ${new Date(data.careerAvailability).toLocaleDateString('fr-FR')}</p>`;
      summary += `<p><strong>CV joint:</strong> ${data.careerCV ? 'Oui' : 'Non'}</p>`;
      break;
  }
  
  // Ajouter le message
  if (data.message) summary += `<p><strong>Message:</strong> ${data.message}</p>`;
  
  return summary;
} 