import { Component, OnInit } from '@angular/core';
import { InstitutionStateService } from '../../services/institution-state.service';
import { Institution } from '../../posts/models/institution';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Article } from '../models/article';
import { InformationService } from '../services/information.service';
import { Section } from '../models/section';
import { MessageService } from 'primeng/api';
import { PostService } from '../../posts/services/post.service';
import { AuthService } from '../../authentication/services/auth.service';
import { UserDetail } from '../../posts/models/user-detail';

type IdentifierEdit =  '' | 'presentacion' | 'contentPresentacion' | 'proposito' | 'contentProposito' |
  'mision' | 'contentMision' |'estructura' | 'contentEstructura' | 'dptoConvenios' | 'contentDptoConvenios' |
  'dptoInternac' | 'contentDptoInternac'


@Component({
  selector: 'app-about-us',
  templateUrl: './about-us.component.html',
  styleUrl: './about-us.component.scss',
  providers: [MessageService]
})
export class AboutUsComponent implements OnInit {

  institution$: Observable<Institution | null> = this.institutionStateService.currentInstitution$;

  public articleIni!: Article;  // "819ab4e8-0856-4aad-b3aa-747e2dba76d9"
  public articleProposito!: Article; // '839db4e8-0856-4aad-b3aa-747e2dba76d9'
  public articleMision!: Article;   // "823ab4e8-0856-4aad-b3aa-747e2dba76d9"
  public articleEstructura!: Article; // "842ib4e8-0856-4aad-b3aa-747e2dba76d9"
  public articleDptoInterac!: Article; //  "846ib4e8-0856-4aad-b3aa-747e2dba76d9"
  public articleDptoConvenios!: Article; // "845ib4e8-0856-4aad-b3aa-747e2dba76d9"

  public contentEdited: string = ''
  public edit: IdentifierEdit = '';
  public articles: Article[] = [];
  public sections: Section[] = [];
  public isAuthenticated: boolean = false; 
  public currentUser!: UserDetail;

  constructor(
    private readonly institutionStateService: InstitutionStateService,
    private readonly sanitizer: DomSanitizer,
    private readonly informationService: InformationService,
    private readonly messageService: MessageService,
    private readonly postService: PostService,
    private readonly authService: AuthService
  ){}

  ngOnInit(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    if(this.isAuthenticated){
      this.postService.getUser().subscribe({
        next:(user: UserDetail) => {
          this.currentUser = user;
        },
        error:(error) => {
          console.error('Error al obtener el usuario actual', error);
        }
      });
    }

    this.informationService.getPresentationArticles().subscribe({
      next: (responseArticles: Article[]) => {
        this.articles = responseArticles;
        console.log('articulos', this.articles);
        this.articleIni = this.articles.find(art => art.uuid === '819ab4e8-0856-4aad-b3aa-747e2dba76d9')!;
        this.articleProposito = this.articles.find(art => art.uuid === '839db4e8-0856-4aad-b3aa-747e2dba76d9')!;
        this.articleMision = this.articles.find(art => art.uuid === '823ab4e8-0856-4aad-b3aa-747e2dba76d9')!;
        this.articleEstructura = this.articles.find(art => art.uuid === '842ib4e8-0856-4aad-b3aa-747e2dba76d9')!;
        this.articleDptoInterac = this.articles.find(art => art.uuid === '846ib4e8-0856-4aad-b3aa-747e2dba76d9')!;
        this.articleDptoConvenios = this.articles.find(art => art.uuid === '845ib4e8-0856-4aad-b3aa-747e2dba76d9')!;
      },
      error: (err) => {
        console.log('Error al obetener los articulos', err);
      }
    });

    this.informationService.getPresentationsSections().subscribe({
      next: (responseSections: Section[]) => {
        this.sections = responseSections;
        console.log('sections', this.sections);
      },
      error: (err) => {
        console.log('Error al obetener las secciones', err);
      }
    });
  }

  public editInfo(contentToEdit: string, idEdit: IdentifierEdit): void{
    this.contentEdited = contentToEdit;
    this.edit = idEdit;
  }

  public safeText(textToSanitizer: string): SafeHtml {
    const normalizedHtml = this.normalizeLineBreaks(textToSanitizer);
    return this.sanitizer.bypassSecurityTrustHtml(normalizedHtml);
  }

  private normalizeLineBreaks(html: string): string {
    return html.replace(/\n/g, '<br>').replace(/&nbsp;/g, ' ');
  }

  saveEdit(isUpdatedArticle: boolean){
    if(isUpdatedArticle){
      this.edit = ''
      this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Articulo editado exitosamente' });
    }else{
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al editar artículo' });
    }
  }

  cancelEdit(){
    this.edit = ''; 
  }
}
