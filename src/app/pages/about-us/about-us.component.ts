import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { InstitutionStateService } from '../../services/institution-state.service';
import { Institution } from '../../posts/models/institution';
import { concatMap, Observable } from 'rxjs';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Article } from '../models/article';
import { InformationService } from '../services/information.service';
import { Section } from '../models/section';
import { MessageService } from 'primeng/api';
import { PostService } from '../../posts/services/post.service';
import { AuthService } from '../../authentication/services/auth.service';
import { UserDetail } from '../../posts/models/user-detail';
import { UploadedMedia } from '../../posts/models/uploaded-media';

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
  @ViewChild('inputMediaArticleIni') 
  public inputMediaArticleIni!: ElementRef<HTMLInputElement>;
  @ViewChild('inputMediaArticleDptoInternac') 
  public inputMediaArticleDptoIternac!: ElementRef<HTMLInputElement>;

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

    this.informationService.getAllArticles().subscribe({
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

    this.informationService.getAllSections().subscribe({
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

  openEditMediaArticleIni(){
    this.inputMediaArticleIni.nativeElement.click();
  }

  openEditMediaArticleDptoInternac(){
    this.inputMediaArticleDptoIternac.nativeElement.click();
  }

  changeInputMediaArticle(event: Event, article: Article){
    if (event.target instanceof HTMLInputElement && event.target.files){
      const mediaFiles = Array.from(event.target.files);
      const formData = new FormData();
      mediaFiles.forEach(file => {
        if(file.type.includes('image')){
          formData.append('images', file);
        }
      })
      
      this.postService.uploadImages(formData).pipe(
        concatMap((uploadResponse: UploadedMedia[]) => {
          const mediasToArticle = uploadResponse.map((media, index)=> ({
            number: index + 1,
            name: media.name,
            type: media.type,
            path: media.urlResource
          }));

          const articleUpdated: any  = {
            section_id: article.section_id,
            date: article.date,
            title: article.title,
            text: article.text,
            medias: mediasToArticle
          }
          return this.informationService.updateArticle(article.uuid, articleUpdated);
        })
      ).subscribe({
        next: (articleUpdated)=>{
          article.medias = articleUpdated.medias;
          this.messageService.add({ severity: 'success', summary: 'Exitoso', detail: 'Articulo editado exitosamente' });
        },
        error: (err) =>{
          console.log('error al actualizar', err);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Error al editar artículo' });
        }
      });
    }
  }
}
