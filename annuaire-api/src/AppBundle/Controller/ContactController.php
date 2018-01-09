<?php

namespace AppBundle\Controller;

use AppBundle\Form\ContactType;
use AppBundle\Entity\Contact;

use FOS\RestBundle\Controller\Annotations;
use FOS\RestBundle\Controller\FOSRestController;
use FOS\RestBundle\Request\ParamFetcherInterface;
use FOS\RestBundle\View\View;

use Nelmio\ApiDocBundle\Annotation\ApiDoc;

use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Form\FormTypeInterface;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * Rest controller for contacts
 *
 * @package AppBundle\Controller
 * @author Gordon Franke <info@nevalon.de>
 */
class ContactController extends FOSRestController
{
    /**
     * return \EntityRepository
     */
    public function getRepo()
    {
      $em = $this->getEm();
      return $em->getRepository('AppBundle:Contact');
    }

    /**
     * return \Doctrine\EntityManager
     */
    public function getEm()
    {
      return $this->getDoctrine()->getManager();
    }

    /**
     * List all contacts.
     *
     * @ApiDoc(
     *   resource = true,
     *   statusCodes = {
     *     200 = "Returned when successful"
     *   }
     * )
     *
     * @Annotations\QueryParam(name="offset", requirements="\d+", nullable=true, description="Offset from which to start listing contacts.")
     * @Annotations\QueryParam(name="count", requirements="\d+", default="20", description="How many contacts to return.")
     *
     * @Annotations\View()
     *
     * @param ParamFetcherInterface $paramFetcher param fetcher service
     *
     * @return array
     */
    public function getContactsAction(ParamFetcherInterface $paramFetcher)
    {
        $repo = $this->getRepo();
        $contacts = $repo->findAll();
        return $contacts;
    }

    /**
     * Creates a new contact from the submitted data.
     *
     * @ApiDoc(
     *   resource = true,
     *   input = "AppBundle\Form\ContactType",
     *   statusCodes = {
     *     200 = "Returned when successful",
     *     400 = "Returned when the form has errors"
     *   }
     * )
     *
     * @Annotations\View()
     *
     * @param Request $request the request object
     *
     * @return FormTypeInterface[]|View
     */
    public function postContactAction(Request $request)
    {
        $contact = new Contact();
        $form = $this->createForm(new ContactType(), $contact);

        $form->submit($request);
        if ($form->isValid()) {
            $em = $this->getEm();
            $em->persist($contact);
            $em->flush();
            return $contact;
        }

        return array(
            'form' => $form
        );
    }

    /**
     * Get a single contact.
     *
     * @ApiDoc(
     *   output = "AppBundle\Entity\Contact",
     *   statusCodes = {
     *     200 = "Returned when successful",
     *     404 = "Returned when the contact is not found"
     *   }
     * )
     *
     * @Annotations\View(templateVar="contact")
     *
     * @param int $id the contact id
     *
     * @return array
     *
     * @throws NotFoundHttpException when contact not exist
     */
    public function getContactAction($id)
    {
        $contact = $this->getRepo()->find($id);
        if (false === $contact) {
            throw $this->createNotFoundException("Contact does not exist.");
        }

        $view = new View($contact);
        return $view;
    }

    /**
     * Update existing contact from the submitted data or create a new contact at a specific location.
     *
     * @ApiDoc(
     *   resource = true,
     *   input = "AppBundle\Form\ContactType",
     *   statusCodes = {
     *     201 = "Returned when a new resource is created",
     *     204 = "Returned when successful",
     *     400 = "Returned when the form has errors"
     *   }
     * )
     *
     * @Annotations\View(
     *   templateVar="form"
     * )
     *
     * @param Request $request the request object
     * @param int     $id      the contact id
     *
     * @return FormTypeInterface|RouteRedirectView
     *
     * @throws NotFoundHttpException when contact not exist
     */
    public function putContactsAction(Request $request, $id)
    {
        $contact = $this->getRepo()->find($id);
        if (false === $contact) {
            $contact = new Contact();
            $contact->id = $id;
            $statusCode = Response::HTTP_CREATED;
        } else {
            $statusCode = Response::HTTP_NO_CONTENT;
        }

        $form = $this->createForm(new ContactType(), $contact);

        $form->submit($request);
        if ($form->isValid()) {
            $em = $this->getEm();
            $em->persist($contact);
            $em->flush();

            return $contact;
        }

        return $form;
    }

    /**
     * Removes a contact.
     *
     * @ApiDoc(
     *   resource = true,
     *   statusCodes={
     *     204 = "Returned when successful",
     *     404 = "Returned when the contact is not found"
     *   }
     * )
     *
     * @param int $id the contact id
     *
     * @return View
     */
    public function deleteContactsAction($id)
    {
      $em = $this->getEm();
      $contact = $this->getRepo()->find($id);
      if (false === $contact) {
          throw $this->createNotFoundException("Contact does not exist.");
      }

      $em->remove($contact);
      $em->flush();

      return $this->routeRedirectView('get_contacts', array(), Response::HTTP_NO_CONTENT);
    }
}
