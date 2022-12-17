import {Serializable} from './base';

export function notEmpty(fld: any): boolean {
  return (fld && fld !== '' && fld !== 'null');
}

export class Application implements Serializable<Application> {
  id !: number | null;
  code !: string | null;
  urlPrefix !: string | null;
  program !: string | null;

  domain_preference1 !: number;
  subdomain1 !: number;
  domain_preference2 !: number;
  subdomain2 !: number;
  additional_subdomains !: string;
  admission_type !: string;
  hobbies !: string;
  special_remarks !: string;
  submission_status !: string;
  submitted !: boolean;
  submitted_at !: string;
  complete !: boolean;

  research_preparationUrl !: string | null;
  sopUrl !: string | null;
  publicationsUrl !: string | null;
  publication1Url !: string | null;
  publication2Url !: string | null;
  work_experienceUrl !: string | null;

  payment_reference !: string;
  payment_status !: string;
  amount !: number;
  payment_date !: string;
  issues !: string;
  verifier_remarks !: string;

  deserialize(input: any): Application {
    console.log("The Application Input is ",input);
    this.id = Number(input?.id);
    this.code = ('000' + input?.application_num).slice(-3);
    this.urlPrefix = ('applications/' + this.id + '/');

    this.domain_preference1 = Number(input?.domain_preference1);
    this.subdomain1 = Number(input?.subdomain1);
    this.domain_preference2 = Number(input?.domain_preference2);
    this.subdomain2 = Number(input?.subdomain2);
    this.additional_subdomains = input?.additional_subdomains;
    this.admission_type = input?.admission_type;
    this.hobbies = input?.hobbies;
    this.special_remarks = input?.special_remarks;
    this.submission_status = input?.submission_status;
    this.submitted = (this.submission_status === 'SUB');
    this.submitted_at = input?.submitted_at;
    this.complete = Boolean(input?.complete);

    this.research_preparationUrl = (notEmpty(input?.research_preparation) ? (this.urlPrefix + 'download?doc=research_preparation') : null);
    this.sopUrl = (notEmpty(input?.statement_of_purpose) ? (this.urlPrefix + 'download?doc=statement_of_purpose') : null);
    this.publicationsUrl = (notEmpty(input?.list_of_publications) ? (this.urlPrefix + 'download?doc=list_of_publications') : null);
    this.publication1Url = (notEmpty(input?.publication1) ? (this.urlPrefix + 'download?doc=publication1') : null);
    this.publication2Url = (notEmpty(input?.publication2) ? (this.urlPrefix + 'download?doc=publication2') : null);
    this.work_experienceUrl = (notEmpty(input?.work_experience) ? (this.urlPrefix + 'download?doc=work_experience') : null);

    this.payment_reference = input?.payment_reference;
    this.payment_status = input?.payment_status;
    this.amount = (notEmpty(input?.amount) ? Number(input?.amount) : 0);
    this.payment_date = input?.payment_date;
    this.issues = input?.issues;
    this.verifier_remarks = input?.verifier_remarks;
    return this;
  }
}


export class CandidateQualification implements Serializable<CandidateQualification> {
  id !: number;
  qualification !: number;
  other !: string;
  awarded_by !: string;
  institution !: string;
  discipline !: string;
  specialization !: string;
  score !: number;
  rank !: number;
  year !: number;
  remarks !: string;
  project_thesis_abstract !: string;
  certificateUrl !: string | null;
  urlPrefix !: string;

  deserialize(input: any): CandidateQualification {
    this.id = Number(input?.id);
    this.urlPrefix = ('candidateQualifications/' + this.id + '/');
    this.qualification = Number(input?.qualification);
    this.other = input?.other;
    this.awarded_by = input?.awarded_by;
    this.institution = input?.institution;
    this.discipline = input?.discipline;
    this.specialization = input?.specialization;
    this.score = input?.score;
    this.rank = input?.rank;
    this.year = input?.year;
    this.remarks = input?.remarks;
    this.project_thesis_abstract = input?.project_thesis_abstract;
    this.certificateUrl = (notEmpty(input?.certificate) ? (this.urlPrefix + 'download_certificate/') : null);
    return this;
  }
}


export class Recommendation implements Serializable<Recommendation> {
  id !: number;
  candidate !: number;
  email !: string;
  full_name !: string;
  title !: string;
  phone !: string;
  designation !: string;
  affiliation !: string;
  waived !: boolean;
  recommendation_status !: string;
  n_reminders !: number;
  received_at !: string;
  frozen !: boolean;
  testimonialUrl !: string | null;
  urlPrefix !: string;

  deserialize(input: any): Recommendation {
    this.id = Number(input.id);
    this.urlPrefix = ('recommendations/' + this.id + '/');
    this.candidate = Number(input.candidate);
    this.email = input.email;
    this.full_name = input.full_name;
    this.title = input.title;
    this.phone = input.phone;
    this.designation = input.designation;
    this.affiliation = input.affiliation;
    this.waived = input.waived;
    this.recommendation_status = input.recommendation_status;
    this.n_reminders = input.n_reminders;
    this.received_at = input.received_at;
    this.frozen = input.frozen;
    this.testimonialUrl = (notEmpty(input.testimonial) ? (this.urlPrefix + 'download_testimonial/') : null);
    return this;
  }
}


export class Candidate implements Serializable<Candidate> {
  id !: number;
  user !: number;
  dob !: string;
  nationality !: string;
  phone !: string;
  mobile_phone !: string;
  address !: string;
  state !: string;
  country_of_residence !: string;
  pincode !: string;
  designation !: string;
  affiliation !: string;
  application !: Application;
  qualifications !: Array<CandidateQualification>;
  recommendations !: Array<Recommendation>;
  urlPrefix !: string;
  photographUrl !: string | null;

  deserialize(input: any): Candidate {
    this.id = Number(input.user.id);
    console.log("The Candidate Deserialize Values are ", input);
    this.urlPrefix = ('candidates/candidates/' + 47 + '/');
    this.user = Number(input.user.id);
    const dobParts = input.dob.split('-');
    this.dob = (dobParts[1] + '-' + dobParts[2] + '-' + dobParts[0]);
    this.nationality = input.nationality;
    this.phone = input.phone;
    this.mobile_phone = input.mobile_phone;
    this.address = input.address;
    this.state = input.state;
    this.country_of_residence = input.country_of_residence;
    this.pincode = input.pincode;
    this.designation = input.designation;
    this.affiliation = input.affiliation;
    for (const i in input.applications) {
      if (input.applications[i].is_active) {
        this.application = new Application().deserialize(input.applications[i]);
      }
    }
    this.qualifications = Array();
    for (const i in input.qualifications) {
      const qual = input.qualifications[i];
      this.qualifications.push(new CandidateQualification().deserialize(qual));
    }
    this.recommendations = Array();
    for (const i in input.recommendations) {
      const reco = input.recommendations[i];
      if (Boolean(reco.is_active)) {
        this.recommendations.push(new Recommendation().deserialize(reco));
      }
    }
    
    console.log("Inside Candidate Class");
    console.log("The urlPrefix is ", this.urlPrefix);
    this.photographUrl = (notEmpty(input.photograph) ? (this.urlPrefix + 'view_photo/') : null);
    console.log("The PhotoGraph URL is ", this.photographUrl);
    return this;
  }

  findQualification(qualType: string, index: number, qualificationTable: any): CandidateQualification | null {
    // find the 'index'-th candidate qualification of type 'qualType'
    // the candidate qualification objects only have the qualification id, not the type - so the 'qualificationTable' is required
    // to get the type corresponding to the id
    let count = 0;
    for (const i in this.qualifications) {
      const candidateQual = this.qualifications[i];
      const qualId = candidateQual.qualification;
      // get the qualification object with the given id
      const qual = qualificationTable.details(qualId);
      if (qual.qualification_type === qualType) {
        // count the number of the candidate qualifications of the given type
        count = count + 1;
      }
      if (count === index) {
        return candidateQual;
      }
    }
    return null;
  }

  countQualifications(qualType: string, qualificationTable: any): number {
    // count the number of candidate qualification of type 'qualType'. 'qualificationTable' is required
    // to get the type corresponding to the id
    let count = 0;
    for (const i in this.qualifications) {
      const candidateQual = this.qualifications[i];
      const qualId = candidateQual.qualification;
      // get the qualification object with the given id
      const qual = qualificationTable.details(qualId);
      if (qual.qualification_type === qualType) {
        // count the number of the candidate qualifications of the given type
        count = count + 1;
      }
    }
    return count;
  }

  findRecommendation(index: number): Recommendation | null {
    return(index > this.recommendations.length) ? null : this.recommendations[index - 1];
  }

  updateQualification(qual: any) : void {
    // update the qualification model from 'qual' fetched from the server
    let found = false;
    for (const i in this.qualifications) {
      if (this.qualifications[i].id === qual.id) {
        // match the id to find the model that needs to be updated
        found = true;
        this.qualifications[i].deserialize(qual);
      }
    }
    if (!found) {
      // if none was found, then a new qualification is created
      this.qualifications.push(new CandidateQualification().deserialize(qual));
    }
  }

  removeQualification(qual: any): void {
    // remove the qualification model --- it is already removed from the server
    for (const i in this.qualifications) {
      if (this.qualifications[i].id === qual.id) {
        // match the id to find the model that needs to be updated
        this.qualifications.splice(Number(i), 1);
        return;
      }
    }
  }

  updateRecommendation(reco: any): void {
    // update the recommendation model from 'reco' fetched from the server
    let found = false;
    for (const i in this.recommendations) {
      if (this.recommendations[i].id === reco.id) {
        // match the id to find the model that needs to be updated
        found = true;
        this.recommendations[i].deserialize(reco);
      }
    }
    if (!found) {
      // if none was found, then a new recommendation is created
      this.recommendations.push(new Recommendation().deserialize(reco));
    }
  }

  removeRecommendation(reco: any): void {
    // remove the recommendation model --- it is already removed from the server
    for (const i in this.recommendations) {
      if (this.recommendations[i].id === reco.id) {
        // match the id to find the model that needs to be updated
        this.recommendations.splice(Number(i), 1);
        return;
      }
    }
  }
}