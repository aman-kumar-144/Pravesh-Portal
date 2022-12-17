import { Serializable } from './base';

export class AdmissionCycle implements Serializable<AdmissionCycle> {
  // AdmissionCycle model
  id !: number;
  year !: number;
  cycle_num !: number;
  has_mscdt !: boolean;

  applications_call_date !: string;
  submissions_begin !: string;
  application_deadline !: string;
  recommendation_deadline !: string;
  application_fee !: number;
  interview_shortlist_announcement !: string;
  interviews_begin !: string;
  interviews_end !: string;
  final_shortlist_announcement !: string;
  preparatory_classes_start !: string;
  acceptance_fee_payment_date !: string;
  joining_date !: string;
  classes_begin !: string;
  last_date_for_course_registrations !: string;

  deserialize(input: any): AdmissionCycle {
    this.id = Number(input.id);
    this.year = input.year;
    this.has_mscdt = Boolean(input.has_mscdt);
    this.cycle_num = Number(input.cycle_num);
    this.applications_call_date = input.applications_call_date;
    this.submissions_begin = input.submissions_begin;
    this.application_deadline = input.application_deadline;
    this.recommendation_deadline = input.recommendation_deadline;
    this.application_fee = input.application_fee;
    this.interview_shortlist_announcement = input.interview_shortlist_announcement;
    this.interviews_begin = input.interviews_begin;
    this.interviews_end = input.interviews_end;
    this.final_shortlist_announcement = input.final_shortlist_announcement;
    this.preparatory_classes_start = input.preparatory_classes_start;
    this.acceptance_fee_payment_date = input.acceptance_fee_payment_date;
    this.joining_date = input.joining_date;
    this.classes_begin = input.classes_begin;
    this.last_date_for_course_registrations = input.last_date_for_course_registrations;
    return this;
  }
}


export class Qualification implements Serializable<Qualification> {
  id !: number;
  name !: string;

  deserialize(input: any): Qualification {
    this.id = Number(input.id);
    this.name = input.name;
    return this;
  }
}

export class QualificationForId implements Serializable<QualificationForId> {
  qualification_type !: string;
  name !: string;

  deserialize(input: any): QualificationForId {
    this.qualification_type = input.qualification_type;
    this.name = input.name;
    return this;
  }
}

export class Qualifications implements Serializable<Qualifications> {
  codeMap !: Map<string, Array<Qualification>>;
  idMap !: Map<number, QualificationForId>;

  deserialize(input: any): Qualifications {
    this.codeMap = new Map<string, Array<Qualification>>();
    this.idMap = new Map<number, QualificationForId>();
    for (const i in input) {
      const item = input[i];
      if (!this.codeMap.get(item.qualification_type)) {
        this.codeMap.set(item.qualification_type, Array());
      }
      this.codeMap.get(item.qualification_type)?.push(new Qualification().deserialize(item));
      this.idMap.set(item.id, new QualificationForId().deserialize(item));
    }
    return this;
  }

  sortQualifications(aArray: Array<Qualification>): Qualification[] {
    return aArray.sort((q1: Qualification, q2: Qualification) => {
      return ( (q1.name > q2.name) ? 1 : ( (q1.name < q2.name) ? -1 : 0));
    });
  }

  names(code: string): Qualification[] {
    return this.sortQualifications(this.codeMap.get(code) || Array());
  }

  details(id: number): QualificationForId | null{
    return this.idMap.get(id) || null;
  }
}


export class Subdomain implements Serializable<Subdomain> {
  id !: number;
  subdomain !: string;

  deserialize(input: any): Subdomain {
    this.id = Number(input.id);
    this.subdomain = input.subdomain;
    return this;
  }
}

export class ProgramDomain implements Serializable<ProgramDomain> {
  id !: number;
  program !: string;
  domain !: string;
  subdomains !: Array<Subdomain>;
  mandatoryPrerequisites !: Map<string, Array<number>>;
  optionalPrerequisites !: Map<string, Array<number>>;
  qualifications !: Qualifications;

  constructor(quals: Qualifications) {
    this.qualifications = quals;
  }

  sortSubdomains(subdoms: Subdomain[]) {
   return subdoms.sort((d1: Subdomain, d2: Subdomain) => {
      return ( (d1.subdomain > d2.subdomain) ? 1 : ( (d1.subdomain < d2.subdomain) ? -1 : 0)) ;
    });
  }

  deserialize(input: any): ProgramDomain {
    this.id = Number(input.id);
    this.program = input.program;
    this.domain = input.domain;
    this.subdomains = Array();
    for (let i in input.subdomains) {
      this.subdomains.push(new Subdomain().deserialize(input.subdomains[i]));
    }
    this.subdomains = this.sortSubdomains(this.subdomains);
    this.mandatoryPrerequisites = new Map<string, Array<number>>();
    this.optionalPrerequisites = new Map<string, Array<number>>();
    for (let i in input.prerequisites) {
      const qid = input.prerequisites[i].qualification;
      const qual = this.qualifications.details(qid);
      const qtype = qual?.qualification_type;
      if (input.prerequisites[i].mandatory) {
        if (qtype!==undefined && !this.mandatoryPrerequisites.get(qtype)) {
          this.mandatoryPrerequisites.set(qtype, Array());
        }
        if(qtype!==undefined) {
          this.mandatoryPrerequisites.get(qtype)?.push(qid);
        }
      } 
      else {
        if (qtype!==undefined && !this.optionalPrerequisites.get(qtype)) {
          this.optionalPrerequisites.set(qtype, Array());
        }
        if(qtype!==undefined) {
          this.optionalPrerequisites.get(qtype)?.push(qid);
        }
      }
    }
    return this;
  }
}

export class Program implements Serializable<Program> {
  // Verbose name of the Program
  name !: string;
  application_deadline !: string;
  recommendation_deadline !: string;
  interview_shortlist_announcement_round1 !: string;
  interviews_begin_round1 !: string;
  interviews_end_round1 !: string;
  final_shortlist_announcement_round1 !: string;
  acceptance_fee_payment_date_round1 !: string;
  interview_shortlist_announcement_round2 !: string;
  interviews_begin_round2 !: string;
  interviews_end_round2 !: string;
  final_shortlist_announcement_round2 !: string;
  acceptance_fee_payment_date_round2 !: string;
  preparatory_classes_start !: string;
  joining_date !: string;
  classes_begin !: string;
  last_date_for_course_registrations !: string;
  // List of ProgramDomains having the same Program code
  programDomains !: Array<ProgramDomain>;

  deserialize(input: any): Program {
    this.name = input.program_name;
    this.application_deadline = input.application_deadline;
    this.recommendation_deadline = input.recommendation_deadline;
    this.interview_shortlist_announcement_round1 = input.interview_shortlist_announcement_round1;
    this.interviews_begin_round1 = input.interviews_begin_round1;
    this.interviews_end_round1 = input.interviews_end_round1;
    this.final_shortlist_announcement_round1 = input.final_shortlist_announcement_round1;
    this.acceptance_fee_payment_date_round1 = input.acceptance_fee_payment_date_round1;
    this.interview_shortlist_announcement_round2 = input.interview_shortlist_announcement_round2;
    this.interviews_begin_round2 = input.interviews_begin_round2;
    this.interviews_end_round2 = input.interviews_end_round2;
    this.final_shortlist_announcement_round2 = input.final_shortlist_announcement_round2;
    this.acceptance_fee_payment_date_round2 = input.acceptance_fee_payment_date_round2;
    this.preparatory_classes_start = input.preparatory_classes_start;
    this.joining_date = input.joining_date;
    this.classes_begin = input.classes_begin;
    this.last_date_for_course_registrations = input.last_date_for_course_registrations;

    this.programDomains = Array();
    return this;
  }

  add(pgmdom: any, qualifications: Qualifications) {
    // Add a program domain to this Program
    this.programDomains.push(new ProgramDomain(qualifications).deserialize(pgmdom));
  }
}

export class Programs implements Serializable<Programs> {
  // Allows getting to a Program object from the program code
  map !: Map<string, Program>;
  // Programs are fetched first --- this flag says whether ProgramDomains have been loaded
  // Each Program object contains the list of all ProgramDomains with the given Program
  pgmDomainsLoaded = false;

  deserialize(input: any): Programs {
    this.map = new Map<string, Program>();
    for (const i in input) {
      const item = input[i];
      this.map.set(item.program, new Program().deserialize(item));
    }
    return this;
  }

  program(code: string) {
    return this.map.get(code);
  }

  name(code: string) {
      return this.program(code)?.name;
  }

  domains(code: string) {
    // Return list of all ProgramDomains with the same program 'code'
    return this.program(code)?.programDomains;
  }

  programs() {
    // Return list of program 'codes'
    return Array.from(this.map.keys());
  }

  add(pgmdom: any, qualifications: any) {
    // Add a ProgramDomain 'pgmdom' under the Program object that has the same program code as 'pgmdom'
    this.map.get(pgmdom.program)?.add(pgmdom, qualifications);
  }

  findProgram(pgmdomId: any): string {
    pgmdomId = Number(pgmdomId)
    // Return the program of the ProgramDomain with the given id 'pgmdomId'
    const keys = Array.from(this.map.keys());
    for (const i in keys) {
      // Walk through each program code
      const program = this.map.get(keys[i]);
      for (const j in program?.programDomains) {
        // Check the ProgramDomains under the program to find the one with the given id
        const pgmdom = program?.programDomains[Number(j)];
        if (pgmdom && Number(pgmdom.id) === Number(pgmdomId)) {
          return pgmdom.program;
        }
      }
    }
    return '';
  }

  loadedPgmDomains() { this.pgmDomainsLoaded = true; }
  fullyLoaded() { return this.pgmDomainsLoaded; }
}