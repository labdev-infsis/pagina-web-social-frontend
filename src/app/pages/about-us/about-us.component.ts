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

  public articleIni!: Article;
  public articleProposito!: Article;
  public articleMision!: Article;
  public articleEstructura!: Article;
  public articleDptoInterac!: Article;
  public articleDptoConvenios!: Article;

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
        this.articleProposito = this.articles.find(art => art.uuid === '839db4e8-0856-4aad-b3aa-747e2dba76d9')!;
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

  get safeText(): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(this.articleProposito.title);
  }

  saveEdit(textEdited: string){
    this.articleProposito.title = textEdited;
    const articleEdited: Omit<Article, 'uuid' | 'user_id'> = {
      section_id: this.articleProposito.section_id,
      date: this.articleProposito.date,
      title: this.articleProposito.title,
      text: this.articleProposito.text,
      medias: this.articleProposito.medias
    }
    this.informationService.updatePresentationArticle(this.articleProposito.uuid, articleEdited).subscribe({
      next: (resArticleEdited: Article) => {
        console.log('articulo editado', resArticleEdited);
        this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Articulo editado exitosamente' });
        this.edit = '';
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al editar artículo' });
        console.log('Error al editar el artículo', err);
      }
    });
  }

  cancelEdit(){
    this.edit = ''; 
  }
}
